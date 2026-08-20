# FonRadar AI — Frontend

Hibe ve destek çağrılarını yapay zekâ ile eşleştiren FonRadar AI'ın web arayüzü.

## Teknolojiler

| Katman    | Seçim                   | Gerekçe                                                                   |
| --------- | ----------------------- | ------------------------------------------------------------------------- |
| Framework | React 19 + Vite         | SSR gerekmiyor (kurum içi panel), Vite hızlı dev server sağlıyor          |
| Language  | TypeScript              | API response'undaki alan adlarını compile time'da doğrulamak için         |
| Styling   | Tailwind CSS v4         | Tailwind UI ücretli olduğu için yalnızca açık kaynak framework kullanıldı |
| Routing   | React Router v7         | Sayfa geçişlerinde URL değişsin ve browser geri tuşu çalışsın diye        |
| Chart     | Recharts                | React-native API, state değişiminde otomatik re-render                    |
| PDF       | jsPDF + html2canvas-pro | Metin selectable kalsın diye; chart'lar image olarak embed ediliyor       |

`html2canvas` yerine `html2canvas-pro` tercih edildi: orijinal paket Tailwind v4'ün `oklch()` renk fonksiyonlarını parse edemiyor.

## Kurulum

```bash
cd frontend
npm install
npm run dev
```

Arayüz `http://localhost:5173` adresinde açılır. Backend'in ayrıca çalışıyor olması gerekir — bkz. kök dizindeki README.

## Komutlar

| Komut             | Açıklama                             |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Development server                   |
| `npm run build`   | Production build (`dist/` klasörüne) |
| `npm run lint`    | ESLint denetimi                      |
| `npm run preview` | Build çıktısını yerelde önizleme     |

## Klasör Yapısı

```
frontend/
├── public/                 Doğrudan sunulan statik dosyalar
│   ├── logo.svg
│   └── radar_icon.svg
├── src/
│   ├── api/                Backend istekleri
│   │   └── grantApi.ts
│   ├── assets/             Logo ve gömülü hali (PDF için)
│   │   └── logo.png
│   │   └── logoBase64.ts
│   ├── components/         JSX bileşenleri
│   │   ├── BrandLogo.tsx
│   │   ├── QueryPanel.tsx
│   │   ├── StatusMessage.tsx
│   │   ├── ReportHeader.tsx
│   │   ├── GrantTable.tsx
│   │   ├── RawGrantTable.tsx
│   │   ├── TopicChart.tsx
│   │   ├── ScopeChart.tsx
│   │   ├── ScoreChart.tsx
│   │   └── ScoreSummary.tsx
│   ├── data/
│   │   └── mockGrants.ts   Development sırasında kullanılan test verileri
│   ├── fonts/
│   │   └── roboto.ts       PDF için gömülü fontlar
│   ├── pages/              Sitenin sayfaları
│   │   ├── SearchPage.tsx
│   │   └── AdminPage.tsx
│   ├── types/              Veri türleri
│   │   ├── Grant.ts
│   │   └── RawGrant.ts
│   ├── utils/              Yardımcı fonksiyon
│   │   └── generatePdf.ts
│   ├── App.tsx             Routing tablosu
│   ├── index.css           Tailwind import'u
│   └── main.tsx            Entry point
├── .gitignore
├── .prettierrc
├── eslint.config.js
├── index.html              HTML kodu
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Sayfalar

**`/` — Arama.** Kullanıcının sorgusu `/match-score` endpoint'ine gönderilir. Dönen fonlar 50 puan eşiğine göre filtrelenir, skora göre sıralanır. Eşik altı fonlar isteğe bağlı görüntülenebilir ve rapora dahil edilebilir.

**`/admin` — Tüm Fonlar.** `/fetch-grants` endpoint'inden ham scraping listesi çekilir. Sayfa mount olduğunda `useEffect` ile otomatik yüklenir.

## State Yönetimi

Arama sonucu altı durumdan birine düşer:

| Durum      | Koşul                                                  |
| ---------- | ------------------------------------------------------ |
| `idle`     | Henüz arama yapılmadı                                  |
| `loading`  | Request gönderildi, response bekleniyor                |
| `success`  | Eşiği geçen fon bulundu                                |
| `lowScore` | Fon bulundu ancak hiçbiri eşiği geçemedi               |
| `empty`    | Hiç fon bulunamadı                                     |
| `error`    | Sunucuya ulaşılamadı veya analiz servisi yanıt vermedi |

Bu ayrım kullanıcıya doğru mesajı göstermek için gerekli: "sonuç yok" ile "servis çalışmıyor" farklı durumlar.

`grantApi.ts` üç katmanda hata ayrımı yapar:

| Katman      | Kontrol        | Anlamı                               |
| ----------- | -------------- | ------------------------------------ |
| Network     | `fetch` throw  | Sunucuya bağlanılamadı               |
| HTTP        | `!response.ok` | Sunucu hata kodu döndü               |
| Application | `durum` alanı  | Sunucu çalıştı ama işi tamamlayamadı |

## Test Modu

Backend'e bağlanmadan arayüz geliştirmek için `src/api/grantApi.ts` içindeki `USE_MOCK` flag'i `true` yapılabilir. Bu modda arama kutusuna yazılan bazı anahtar kelimeler farklı senaryoları tetikler:

| Sorgu   | Senaryo                 |
| ------- | ----------------------- |
| `hata`  | Sunucu hatası           |
| `bos`   | Sonuç bulunamadı        |
| `dusuk` | Tüm fonlar eşik altında |
| `tek`   | Tek sonuç               |
| `kirli` | Eksik alanlı veri       |

Admin sayfası için `ADMIN_SCENARIO` sabiti aynı amaçla kullanılır.

Push öncesi `USE_MOCK` değerinin `false` olduğu doğrulanmalıdır.

## PDF Raporu

`generatePdf.ts` jsPDF ile metin tabanlı rapor üretir:

- **Kapak:** Logo, arama sorgusu, tarih, fon sayıları
- **Grafik sayfası:** `html2canvas-pro` ile image olarak
- **Fon sayfaları:** Her fon ayrı sayfada — başlık, skor, konu, kapsam, hibe oranı, son başvuru, açıklama, tıklanabilir link

Türkçe karakter desteği için Roboto fontu base64 olarak embed edilmiştir; jsPDF'in built-in fontları `ş ğ ı İ` karakterlerini desteklemiyor.

## Bilinen Sınırlamalar

- PDF'e gömülen chart'lar image olduğu için metinleri selectable değil.
- Backend'in LLM skorlaması yoğunlukta birkaç dakika sürebilir; bu süre boyunca `loading` durumu gösterilir.
