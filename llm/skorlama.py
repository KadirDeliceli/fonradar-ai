"""
FonRadar AI - Skorlama Modulu (tek asamali)
===========================================
Semantik aramadan gelen (dedup edilmis) fonlarin TAM metnini alir, kullanicinin
serbest metin sorgusuyla karsilastirir ve TEK LLM cagrisinda hem alanlari cikarir
hem skoru verir. Iki ayri cagri (once ozetle, sonra skorla) YAPMAZ.

LangChain'in with_structured_output'u sayesinde cikti dogrudan Pydantic modeline
dogrulanir; elle json.loads / try-except gerekmez.

Kullanim:
    from llm.skorlama import fonlari_skorla
    sonuclar = fonlari_skorla(skorlanacak, sorgu)   # skora gore sirali liste
"""
from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, Field

from llm.llm import get_llm

MAKS_KARAKTER = 15000


class FonSkoru(BaseModel):
    """Bir fonun kullanici sorgusuna gore skoru ve cikarilan alanlar."""
    skor: int = Field(
        ge=0,
        le=100,
        description="Fonun kullanici ihtiyacina uygunlugu (0-100 arasi hassas tam sayi)",
    )
    aciklama: str = Field(
        description="Fonun kimligi, sehir ve konu uyumunu kapsayan detayli gerekce ve aciklama metni"
    )
    sehir_durumu: Literal["uyuyor", "ulusal", "uymuyor", "bilgi_yok"] = Field(
        description="Sorgudaki sehir fona uyuyor mu (ozel sehirse 'uyuyor', tum Turkiye ise 'ulusal', uymuyorsa 'uymuyor', veri yoksa 'bilgi_yok')"
    )
    konu: str = Field(
        description="Fonun metinden cikarilan ana odagi veya konusu (kisa ve oz)"
    )
    son_basvuru: Optional[str] = Field(
        default=None,
        description="Fonun son basvuru tarihi (metinde acikca varsa tarih yazilir, yoksa null)",
    )
    hibe_orani: Optional[str] = Field(
        default=None,
        description="Fonun hibe/destek orani veya bütce limiti (metinde acikca varsa yazilir, yoksa null)",
    )


PROMPT_SABLONU = """Sen uzman bir hibe ve fon analistisin. Kullanıcının ihtiyacı ile sana sağlanan fon metnini kıyaslayıp dinamik, esnek ve hassas bir uygunluk değerlendirmesi yapacaksın.

KULLANICI SORGUSU:
{sorgu}

FON BAŞLIĞI: {baslik}
FON METNİ:
{metin}

HASSAS SKORLAMA VE PUAN KESME/EKLEME MANTIĞI:
1. Temel Taban Puanı Belirle:
   - 90 - 100 Derece: Fon metninde kullanıcının konusu "özel çağrı", "öncelikli alan" veya "hedef sektör" olarak AÇIKÇA geçiyorsa.
   - 70 - 89 Derece: Fon genel bir Ar-Ge/teknoloji şemsiye desteğiyse ve kullanıcının konusunu kapsıyorsa.
   - 40 - 69 Derece: Fon kısmen alakalıysa veya ağır özel katılım şartları (müşteri bulma, eş-finansman vb.) barındırıyorsa.
   - 1 - 39 Derece: Konuyla çok az/dolaylı alakalıysa.
   - 0 Derece: Kullanıcı konusuyla ve Ar-Ge ile tamamen alakasızsa.

2. Makro/Mikro Puan Ayarlaması ve Kesintiler (Kesinlikle Uygula):
   - Kesinlikle 70, 80, 90 gibi yuvarlak ve sabit sayılara takılı kalma; 73, 82, 68 gibi hassas tam sayı (integer) puanlar ver.
   - BARIYER/KESİNTİ KURALI: Eğer fon genel bir destek sunuyor ama kullanıcının konusuna ÖZEL bir öncelik vermiyorsa, ya da müşteri/ortak bulma gibi ekstra yükümlülükler getiriyorsa taban puandan 3 ila 15 puan arasında MAKRO KESİNTİ yap.
   - AVANTAJ KURALI: Yüksek hibe oranı (%75 vb.), KOBİ dostu başvuru koşulları veya esnek takvim gibi avantajlar varsa puana 2 ila 5 puan MİKRO EKLEME yap.
   - Potansiyeli düşük veya şartı uymayan fonlarda puanı cömert davranmayıp kararlılıkla KES.

DETAYLI KURALLAR:
1. aciklama: Açıklamayı mutlaka şu akışla 2-4 cümle olarak yaz:
   - Önce fonsal kimliği ve kapsamı belirt (Örn: "Bu fon [Fon Başlığı], Türkiye genelinde / [Şehir] bölgesinde geçerli bir destektir.").
   - Ardından kullanıcının şehri ve konusuyla uyumunu açıkla (Örn: "Kullanıcının talep ettiği [Konu] alanındaki projeleri kapsamakta / bu alana özel öncelik sağlamaktadır.").
   - Kesinlikle "puan kestim", "puan ekledim" gibi ifadeler kullanma; skoru doğrudan içeriğin uygunluğu ve şartların elverişliliği üzerinden gerekçelendir.

2. sehir_durumu:
   - Kullanıcının şehri fon hedeflerinde açıkça varsa -> 'uyuyor'
   - Fon ulusal/genel bir kapsama sahipse (tüm Türkiye'yi kapsıyorsa) -> 'ulusal'
   - Fon doğrudan başka bir coğrafyaya/şehre özelse -> 'uymuyor'
   - Metinde şehir bilgisi yoksa veya sorguda belirtilmediyse -> 'bilgi_yok'

3. konu: Fonun metinden çıkarılan ana odağı/konusu (kısa ve öz).
4. son_basvuru: Metinde GERÇEKTEN geçen son başvuru tarihi varsa yaz, yoksa null bırak.
5. hibe_orani: Metinde GERÇEKTEN geçen hibe oranı veya bütçe limitini yaz, yoksa null bırak.

Yanıtlarında yalnızca sağlanan metindeki gerçek verilere dayan, varsayımda bulunma.

Kritik Kural: Asla markdown (```) veya ekstra metin kullanma. Cevabın doğrudan {{ sembolü ile başlayan ve }} sembolü ile biten saf bir json objesi olmalıdır.

Örnek Format:
{{
  "skor": 78,
  "aciklama": "Bu fon...",
  "sehir_durumu": "ulusal",
  "konu": "Ar-Ge ve Yenilik",
  "son_basvuru": null,
  "hibe_orani": "%75"
}}
"""


# Yapili LLM'i BIR KEZ kur, her fon icin yeniden yaratma (optimizasyon).
_yapili_llm = None


def _get_yapili_llm():
    global _yapili_llm
    if _yapili_llm is None:
        _yapili_llm = get_llm().with_structured_output(FonSkoru, method="json_mode")
    return _yapili_llm


def _metni_hazirla(fon: dict) -> str:
    """full_text'i alir; sadece anormal uzunsa emniyet tavanina kirpar."""
    metin = fon.get("full_text", "") or ""
    if len(metin) > MAKS_KARAKTER:
        metin = metin[:MAKS_KARAKTER] + "\n...[metin kisaltildi]"
    return metin


def fonu_skorla(fon: dict, sorgu: str) -> FonSkoru:
    """Tek fonu tek LLM cagrisinda skorlar, FonSkoru doner."""
    prompt = PROMPT_SABLONU.format(
        sorgu=sorgu.strip(),
        baslik=fon.get("baslik", ""),
        metin=_metni_hazirla(fon),
    )
    return _get_yapili_llm().invoke(prompt)


def fonlari_skorla(fonlar: list[dict], sorgu: str) -> list[dict]:
    """
    Fon listesini skorlar, skora gore YUKSEKTEN DUSUGE sirali dict listesi doner.
    Her sonuc: skor, aciklama, sehir_durumu, konu, son_basvuru, hibe_orani + baslik + url.
    Bir fon skorlanamazsa atlanir (tumunu cokertmez).
    """
    sonuclar = []
    for i, fon in enumerate(fonlar, 1):
        baslik = fon.get("baslik", "?")
        print(f"[SKOR] ({i}/{len(fonlar)}) {baslik}")
        try:
            skor = fonu_skorla(fon, sorgu)
            sonuclar.append({
                **skor.model_dump(),
                "baslik": baslik,
                "url": fon.get("url"),
            })
        except Exception as e:
            print(f"[SKOR HATA] {baslik} -> {e}")

    sonuclar.sort(key=lambda x: x["skor"], reverse=True)
    return sonuclar