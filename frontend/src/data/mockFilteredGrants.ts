import type { filteredGrant } from "../types/filteredGrant.ts";

export const mockFilteredGrants: filteredGrant[] = [
    {
        skor: 98,
        aciklama: "Bu fon 1831 Yeşil İnovasyon Teknoloji Mentörlük Çağrısı, " +
            "Türkiye genelinde KOBİ'lere yönelik yeşil dönüşüm alanında teknik destek sağlayan bir çağrıdır. " +
            "Ankara Sanayi Odası da çözüm ortaklarından biri olduğu için Ankara'daki firmalar da bu programa başvurabilir. " +
            "Kullanıcının talep ettiği yeşil dönüşüm konusuna doğrudan öncelik verilmektedir.",
        sehir_durumu: "ulusal",
        konu: "Yeşil İnovasyon Teknoloji Mentörlük",
        son_basvuru: "2030-01-01",
        hibe_orani: "%90",
        baslik: "1831 Yeşil İnovasyon Teknoloji Mentörlük Çağrısı",
        url: "https://tubitak.gov.tr/tr/destekler/sanayi/ulusal-destek-programlari/1831-yesil-inovasyon-teknoloji-mentorluk-cagrisi"
    },
    {
        skor: 50,
        aciklama: "Bu fon 1832 - Sanayide Yeşil Dönüşüm Çağrısı, Türkiyegenelinde geçerli bir destek programıdır. " +
            "Kullanıcın Ankara'da yeşil dönüşüm projeleri için uygundur, çünkü şehir bazlı kısıtlama yoktur.",
        sehir_durumu: "ulusal",
        konu: "Yeşil Dönüşüm Ar-Ge ve Yenilik",
        son_basvuru: "null", // Burada normalde null yazmış arkadaş ama ben string bekliyorum o yüzden onun düzeltilmesi gerekiyor.
        hibe_orani: "%70-%90",
        baslik: "1832 - Sanayide Yeşil Dönüşüm Çağrısı",
        url: "https://tubitak.gov.tr/tr/destekler/sanayi/ulusal-destek-programlari/1832-sanayide-yesil-donusum-cagrisi",
    }
]