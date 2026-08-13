import type {nonFilteredGrant} from "../types/nonFilteredGrant.ts"

const baseGrants: nonFilteredGrant[] = [
    {
        url: "null",
        baslik: "1831 Yeşil İnovasyon Teknoloji Mentörlük Çağrısı",
    },
    {
        url: "https://tubitak.gov.tr/tr/destekler/sanayi/ulusal-destek-programlari/1832-sanayide-yesil-donusum-cagrisi",
        baslik: "1832 - Sanayide Yeşil Dönüşüm Çağrısı",
    }
];

// Yardımcı Rastgele Fonksiyonları
const getRandomInt = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomElement = <T>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)];

// Havuzlardan rastgele kombinasyon seçerek anlamlı veri türetme
const konular = ["Yeşil Dönüşüm", "Dijitalizasyon Ar-Ge", "Enerji Verimliliği", "Yapay Zeka Entegrasyonu", "Sürdürülebilir Altyapı"];

export function generateMockGrants(count: number): nonFilteredGrant[] {
    const generated: nonFilteredGrant[] = [];

    for (let i = 1; i <= count; i++) {
        const randomId = getRandomInt(1500, 1999);
        const konu = getRandomElement(konular);
        generated.push({
            url: `https://tubitak.gov.tr{randomId}`,
            baslik: `${randomId} - ${konu} Destek Çağrısı`
        });
    }

    return generated;
}

// Örnek Kullanım: 100 adet mock veri üret ve export et
export const generatedMockGrants: nonFilteredGrant[] = [
    ...baseGrants, // Orijinal elinizdeki 2 veriyi korur
    ...generateMockGrants(100) // Üzerine 100 tane rastgele ekler
];
