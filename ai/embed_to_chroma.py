"""
FonRadar AI - Embedding + Chroma Yukleme Modulu
================================================
fonlar.json'daki her fonun metnini parcalara boler (chunking), her parcayi
bir vektore cevirir (embedding) ve yerel Chroma vektor veritabanina yazar.
Sonra kurum onceligine gore anlamca en yakin fonlari aramak icin kullanilir.

Kullanilan (hepsi ucretsiz/acik kaynak):
  chromadb, sentence-transformers
Kurulum:
  pip install chromadb sentence-transformers

Calistirma:
  python embed_to_chroma.py           # yukler + ornek arama yapar

NOT: Ilk calistirmada embedding modeli (~120 MB) HuggingFace'ten bir kez
     internetten iner. Sonrasinda cevrimdisi calisir.
"""

import json
import re

import chromadb
from chromadb.utils import embedding_functions

# ---------------------------------------------------------------------------
# AYARLAR
# ---------------------------------------------------------------------------
from pathlib import Path

# Bu dosya .../ai/embed_to_chroma.py  ->  iki ust klasor = repo koku
KOK = Path(__file__).resolve().parent.parent

def _bul_json():
    """fonlar.json'u olasi yerlerde arar, ilk bulunani kullanir."""
    adaylar = [
        KOK / "scraper" / "fonlar.json",
        KOK / "data" / "fonlar.json",
        KOK / "fonlar.json",
    ]
    for a in adaylar:
        if a.exists():
            print(f"[JSON] Bulundu: {a}")
            return a
    raise FileNotFoundError(
        "fonlar.json bulunamadi. Baktigim yerler:\n  " +
        "\n  ".join(str(a) for a in adaylar)
    )

JSON_PATH = _bul_json()
CHROMA_DIR = str(KOK / "data" / "chroma")
COLLECTION_NAME = "fonlar"
CHUNK_SIZE = 1200                  # bir parcadaki maks karakter
CHUNK_OVERLAP = 200               # parcalar arasi ortusme (baglam kopmasin)
BATCH = 500                        # Chroma'ya kacar kacar eklensin
RESET = True                       # True: her calistirmada koleksiyonu sifirla

# Cok dilli, Turkce'yi iyi tutan, kucuk ve hizli model.
# Daha kaliteli isterseniz: "paraphrase-multilingual-mpnet-base-v2" (daha yavas)
MODEL_NAME = "paraphrase-multilingual-MiniLM-L12-v2"


# ---------------------------------------------------------------------------
# METNI PARCALARA BOL (CHUNKING)
# ---------------------------------------------------------------------------
def chunk_text(text: str, size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    """
    Metni satir/paragraf sinirlarina saygi gostererek ~size karakterlik
    parcalara boler. Cok uzun tek bir paragraf varsa onu ortusmeli
    (overlap) sekilde zorla boler ki cumleler ortadan kesilince baglam kopmasin.
    """
    text = re.sub(r"\n{3,}", "\n\n", text).strip()
    paragraflar = [p.strip() for p in text.split("\n") if p.strip()]

    chunks, cur = [], ""
    for p in paragraflar:
        if len(cur) + len(p) + 1 <= size:
            cur = (cur + "\n" + p).strip()
        else:
            if cur:
                chunks.append(cur)
            if len(p) > size:                       # tek paragraf cok uzunsa
                for i in range(0, len(p), size - overlap):
                    chunks.append(p[i:i + size])
                cur = ""
            else:
                cur = p
    if cur:
        chunks.append(cur)
    return chunks


# ---------------------------------------------------------------------------
# EMBEDDING FONKSIYONU
# ---------------------------------------------------------------------------
def get_embedding_function():
    """
    Varsayilan: yerel sentence-transformers (ucretsiz, cevrimdisi).
    Alternatif: Gemini API (asagidaki yorumu ac, key'ini gir).
    """
    return embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name=MODEL_NAME
    )

    # --- Gemini alternatifi (az sayida parca icin; free tier gunluk limitli) ---
    # return embedding_functions.GoogleGeminiEmbeddingFunction(
    #     api_key="GEMINI_API_KEY_BURAYA",   # ideali: os.environ["GEMINI_API_KEY"]
    #     model_name="models/text-embedding-004",
    # )


# ---------------------------------------------------------------------------
# YUKLEME (INGEST)
# ---------------------------------------------------------------------------
def ingest():
    with open(JSON_PATH, encoding="utf-8") as f:
        data = json.load(f)

    client = chromadb.PersistentClient(path=CHROMA_DIR)

    if RESET:
        try:
            client.delete_collection(COLLECTION_NAME)
            print(f"[RESET] Eski '{COLLECTION_NAME}' koleksiyonu silindi.")
        except Exception:
            pass

    col = client.get_or_create_collection(
        name=COLLECTION_NAME,
        embedding_function=get_embedding_function(),
        metadata={"hnsw:space": "cosine"},   # anlamsal benzerlik icin kosinus
    )

    # Tum parcalari hazirla
    docs, metas, ids = [], [], []
    for i, rec in enumerate(data):
        for j, parca in enumerate(chunk_text(rec["full_text"])):
            docs.append(parca)
            metas.append({
                "url": rec["url"],
                "baslik": rec["baslik"],
                "chunk": j,
            })
            ids.append(f"{i}_{j}")

    print(f"[HAZIR] {len(data)} fon -> {len(docs)} parca. Embedding basliyor...")

    # Toplu (batch) ekleme + ilerleme
    for k in range(0, len(docs), BATCH):
        col.add(
            documents=docs[k:k + BATCH],
            metadatas=metas[k:k + BATCH],
            ids=ids[k:k + BATCH],
        )
        print(f"    {min(k + BATCH, len(docs))}/{len(docs)} parca eklendi")

    print(f"[BITTI] Koleksiyonda toplam {col.count()} parca. DB: {CHROMA_DIR}")
    return col


# ---------------------------------------------------------------------------
# ARAMA (anlamsal eslestirme)
# ---------------------------------------------------------------------------
def ara(sorgu: str, k: int = 5):
    """Verilen sorguya anlamca en yakin k parcayi dondurur ve yazar."""
    client = chromadb.PersistentClient(path=CHROMA_DIR)
    col = client.get_collection(
        COLLECTION_NAME, embedding_function=get_embedding_function()
    )
    sonuc = col.query(query_texts=[sorgu], n_results=k)

    print(f"\n'{sorgu}' icin en yakin {k} sonuc:\n" + "-" * 60)
    for meta, mesafe, dok in zip(
        sonuc["metadatas"][0], sonuc["distances"][0], sonuc["documents"][0]
    ):
        print(f"[benzerlik ~{1 - mesafe:.2f}] {meta['baslik']}")
        print(f"   {meta['url']}")
        print(f"   ...{dok[:140].strip()}...\n")
    return sonuc


if __name__ == "__main__":
    #ingest()
    # Yukleme bitince ornek bir arama ile calistigini gorelim:
    ara("KOBI'ler icin yapay zeka ve yazilim gelistirme destegi")