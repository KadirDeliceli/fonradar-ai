import json
import time

from fon.fon import skorlanacak_fonlar
from llm.skorlama import fonlari_skorla


def run(kullanici_sorgusu: str = "Ankaradaki Yeşil Dönüşüm Fonları") -> str:
    """
    Belirtilen kullanıcı sorgusu için fonları ChromaDB'den çeker, LLM ile skorlar
    ve sonucu JSON string olarak döndürür.
    """
    baslangic_zamani = time.time()

    from tubitak_Scraper.vector_db import build_vector_db
    build_vector_db()
    # 1. Başlangıç zamanını kaydet


    # LLM icin yapilandirilmis prompt (skorlama sehir talebini de dikkate alsin)
    user_prompt = f"""Aşağıdaki kurum bilgilerine göre mevcut fonları değerlendir ve kurumun şehir talebi varsa bunu da göz önünde bulundur:
    {kullanici_sorgusu}
    """

    # Chroma'dan aday fonlari getir (sade sorgu ile)
    fonlar = skorlanacak_fonlar(kullanici_sorgusu, limit=5)

    # Sonuçları tutacağımız değişken
    nihai_sonuc = []

    if not fonlar:
        print("Skorlanacak fon bulunamadi. (Arama sonucu bos ya da JSON senkronsuz.)")
        # Fon bulunamazsa hata mesajını JSON formatında hazırlıyoruz
        nihai_sonuc = {"hata": "Skorlanacak fon bulunamadı."}
    else:
        # LLM ile skorla (detayli prompt ile), sonuc skora gore sirali doner
        nihai_sonuc = fonlari_skorla(fonlar, user_prompt)

    # 2. Bitiş zamanını kaydet ve geçen süreyi hesapla
    gecen_saniye = round(time.time() - baslangic_zamani, 2)
    dakika = int(gecen_saniye // 60)
    kalan_saniye = round(gecen_saniye % 60, 2)

    # 3. İstenen formatta konsola süreyi yazdır
    print("\n" + "=" * 50)
    if dakika > 0:
        print(
            f"İşlem Toplam {gecen_saniye} saniyede bitti ({dakika} dk"
            f" {kalan_saniye} saniye)."
        )
    else:
        print(f"İşlem Toplam {gecen_saniye} saniyede bitti.")
    print("=" * 50)

    # 4. JSON Sonucunu DÖNDÜR
    return json.dumps(nihai_sonuc, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    # Fonksiyonu çalıştır ve dönen JSON sonucunu bir değişkene al
    json_ciktisi = run()

    # Dönen JSON sonucunu kontrol amaçlı ekrana yazdır
    print("\n--- FONKSİYONDAN DÖNEN JSON ---")
    print(json_ciktisi)