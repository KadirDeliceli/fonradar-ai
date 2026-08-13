import type {filteredGrant} from "../types/filteredGrant.ts";

const baseGrants: filteredGrant[] = [
    {
        skor: 98,
        aciklama: "Bu fon 1831 Yeşil İnovasyon Teknoloji Mentörlük Çağrısı, Türkiye genelinde KOBİ'lere yönelik yeşil dönüşüm alanında teknik destek sağlayan bir çağrıdır. Ankara Sanayi Odası da çözüm ortaklarından biri olduğu için Ankara'daki firmalar da bu programa başvurabilir. Kullanıcının talep ettiği yeşil dönüşüm konusuna doğrudan öncelik verilmektedir.",
        sehir_durumu: "ulusal",
        konu: "Yeşil İnovasyon Teknoloji Mentörlük",
        son_basvuru: "2030-01-01",
        hibe_orani: "%90",
        baslik: "1831 Yeşil İnovasyon Teknoloji Mentörlük Çağrısı",
        url: "null"
    },
    {
        skor: 50,
        aciklama: "null",
        sehir_durumu: "ulusal",
        konu: "Yeşil Dönüşüm Ar-Ge ve Yenilik",
        son_basvuru: "null",
        hibe_orani: "%70-%90",
        baslik: "1832 - Sanayide Yeşil Dönüşüm Çağrısı",
        url: "https://tubitak.gov.tr/tr/destekler/sanayi/ulusal-destek-programlari/1832-sanayide-yesil-donusum-cagrisi",
    }
];

// Yardımcı Rastgele Fonksiyonları
const getRandomInt = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomElement = <T>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)];

// Havuzlardan rastgele kombinasyon seçerek anlamlı veri türetme
const konular = ["Yeşil Dönüşüm", "Dijitalizasyon Ar-Ge", "Enerji Verimliliği", "Yapay Zeka Entegrasyonu", "Sürdürülebilir Altyapı"];
const sehirDurumlari = ["ulusal", "bölgesel", "yerel"];
const hibeOranlari = ["%50", "%70", "%75", "%90", "%60-%80"];
const tarihler = ["2026-12-31", "2027-06-30", "2028-01-15", "2030-01-01", "null"];

export function generateMockGrants(count: number): filteredGrant[] {
    const generated: filteredGrant[] = [];

    for (let i = 1; i <= count; i++) {
        const randomId = getRandomInt(1500, 1999);
        const konu = getRandomElement(konular);
        const sehirDurumu = getRandomElement(sehirDurumlari);

        // İlk aşamada belirlediğimiz renk sınırlarına (Kırmızı, Turuncu, Sarı, Yeşil) dağılacak rastgele skor
        const skor = getRandomInt(10, 100);

        generated.push({
            skor: skor,
            baslik: `${randomId} - ${konu} Destek Çağrısı`,
            konu: konu,
            sehir_durumu: sehirDurumu,
            hibe_orani: getRandomElement(hibeOranlari),
            son_basvuru: getRandomElement(tarihler),
            url: `https://tubitak.gov.tr/${randomId}-{i}`,
            aciklama: `Bu fon ${randomId} kodlu ${konu} programıdır. Türkiye genelinde ve özellikle ${sehirDurumu} düzeyde faaliyet gösteren KOBİ'lerin projeleri için uygundur. Kullanıcının talep ettiği kriterlere göre eşleşme skoru %${skor} olarak hesaplanmıştır.`,
        });
    }

    return generated;
}

// Örnek Kullanım: 100 adet mock veri üret ve export et
export const generatedMockGrants: filteredGrant[] = [
    ...baseGrants, // Orijinal elinizdeki 2 veriyi korur
    ...generateMockGrants(100) // Üzerine 100 tane rastgele ekler
];
