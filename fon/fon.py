from tubitak_Scraper.vector_db import _bul_json, ara
import json
def benzersiz_fonlar(sonuc, limit=10):
    """
    Chroma sonucundaki chunk'lari url'e gore tekler (dedup) ve benzerlik
    sirasini KORUR. Ayni fonun birden cok chunk'i gelirse ilk (en alakali)
    olani alinir, gerisi atlanir.
    """
    gorulen = set()
    fonlar = []
    for meta, mesafe in zip(sonuc["metadatas"][0], sonuc["distances"][0]):
        url = meta.get("url")
        if not url or url in gorulen:
            continue
        gorulen.add(url)
        fonlar.append({
            "url": url,
            "baslik": meta.get("baslik", ""),
            "benzerlik": 1 - mesafe,
        })
        if len(fonlar) >= limit:
            break
    return fonlar


def skorlanacak_fonlar(arama_metni: str, limit: int = 5):
    """
    1) Chroma'da sade arama metniyle sorgular,
    2) sonuclari url'e gore tekler,
    3) o url'lerin TAM kaydini fonlar.json'dan cekar.
    Benzerlik sirasi korunur; JSON'da bulunamayan url'ler icin uyari verir.
    """
    # Chroma'dan genis havuz cek, dedup ile 'limit' adet benzersiz fona indir
    sonuc = ara(arama_metni, k=25)
    secilen = benzersiz_fonlar(sonuc, limit=limit)

    # JSON'daki tam kayitlari url -> kayit sozlugune al (hizli erisim)
    with open(_bul_json(), encoding="utf-8") as f:
        tum_fonlar = json.load(f)
    url_to_fon = {fon.get("url"): fon for fon in tum_fonlar if fon.get("url")}

    skorlanacak = []
    eksik = []
    for s in secilen:
        fon = url_to_fon.get(s["url"])
        if fon is None:
            eksik.append(s["url"])   # Chroma'da var ama JSON'da yok denkron olmamaış !
            continue
        skorlanacak.append(fon)

    if eksik:
        print(f"[UYARI] Chroma'da olup JSON'da bulunamayan {len(eksik)} fon atlandi.")
        print("        (Chroma ile fonlar.json senkronsuz olabilir; ingest'i yenileyin.)")
        for u in eksik:
            print("        -", u)

    return skorlanacak

