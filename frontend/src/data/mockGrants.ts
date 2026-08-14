import type { grant } from "../types/grant.ts";

export const mockGrants: grant[] = [
    {
        skor: 92,
        baslik: "1833 - SAYEM Yeşil Dönüşüm Çağrısı",
        konu: "Yeşil Dönüşüm ve Ar-Ge",
        aciklama:
            "Bu fon Türkiye genelinde geçerli bir destektir. Özel sektör, üniversite ve kamu iş birliğiyle yenilik platformları oluşturarak yeşil dönüşüme yönelik ürün geliştirilmesine destek sağlar.",
        sehir_durumu: "ulusal",
        son_basvuru: "04 Haziran 2026",
        hibe_orani: "%90",
        url: "https://tubitak.gov.tr/tr/destekler/sanayi/ulusal-destek-programlari/1833-sayem-yesil-donusum-cagrisi",
    },
    {
        skor: 85,
        baslik: "1832 - Sanayide Yeşil Dönüşüm Çağrısı",
        konu: "Yeşil Dönüşüm ve Ar-Ge",
        aciklama:
            "Türkiye genelinde geçerli bir destek programıdır. Ar-Ge ve yenilik faaliyetlerini desteklemeye yöneliktir.",
        sehir_durumu: "ulusal",
        son_basvuru: null,
        hibe_orani: "%80",
        url: "https://tubitak.gov.tr/tr/destekler/sanayi/ulusal-destek-programlari/1832-sanayide-yesil-donusum-cagrisi",
    },
    {
        skor: 74,
        baslik: "1831 Yeşil İnovasyon Teknoloji Mentörlük Çağrısı",
        konu: "Yeşil İnovasyon ve Teknoloji Mentörlüğü",
        aciklama:
            "KOBİ'lerin yeşil dönüşüm süreçlerinde teknik yardım almasına yönelik destek sunar.",
        sehir_durumu: "ulusal",
        son_basvuru: "15 Eylül 2026",
        hibe_orani: "%90",
        url: null,
    },
    {
        skor: 61,
        baslik: "1707 - Siparişe Dayalı Ar-Ge Projeleri için KOBİ Destekleme Çağrısı",
        konu: "Ar-Ge ve Yenilik",
        aciklama:
            "Tüm sektörlerden ve tüm teknoloji alanlarından, ticarileşme potansiyeli yüksek Ar-Ge projelerini destekler.",
        sehir_durumu: "ulusal",
        son_basvuru: "13 Kasım 2026",
        hibe_orani: null,
        url: "https://tubitak.gov.tr/tr/destekler/sanayi/ulusal-destek-programlari/1707-siparise-dayali-ar-ge-projeleri-icin-kobi-destekleme-cagrisi",
    },
    {
        skor: 53,
        baslik: null,
        konu: "Ar-Ge ve Yenilik",
        aciklama:
            "1507 - TÜBİTAK KOBİ Ar-Ge Başlangıç Destek Programı. KOBİ'lerin teknoloji ve yenilik kapasitelerini geliştirmeyi hedefler.",
        sehir_durumu: "ulusal",
        son_basvuru: null,
        hibe_orani: "%75",
        url: "https://tubitak.gov.tr/tr/destekler/sanayi/ulusal-destek-programlari/1507-tubitak-kobi-ar-ge-baslangic-destek-programi",
    },
];

export const mockRawGrants = [
    {
        baslik: "1501-Sanayi Ar-Ge Destek Programı 2026 yılı 2. Çağrısı Açıldı",
        url: "https://tubitak.gov.tr/1501",
    },
    {
        baslik: "1507-KOBİ Ar-Ge Başlangıç Destek Programı 2026 yılı 2. Çağrısı Açıldı",
        url: "https://tubitak.gov.tr/1507",
    },
    {
        baslik: "1707 Siparişe Dayalı Ar-Ge Projeleri için KOBİ Destekleme 2026-2 Çağrısı Açıldı",
        url: "https://tubitak.gov.tr/1707",
    },
    { baslik: "1711 Yapay Zeka Ekosistem 2026 Yılı Çağrısı Açıldı", url: null },
    { baslik: null, url: "https://tubitak.gov.tr/1831" },
];
