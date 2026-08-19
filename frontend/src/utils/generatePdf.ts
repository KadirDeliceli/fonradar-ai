import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";
import type { Grant } from "../types/Grant.ts";
import { logoBase64 } from "../assets/logoBase64.ts";
import { robotoBold, robotoRegular } from "../fonts/roboto.ts";

type PdfParams = {
    grants: Grant[];
    searchTerm: string;
    threshold: number;
    totalFound: number;
};

function fontYukle(pdf: jsPDF) {
    pdf.addFileToVFS("Roboto-Regular.ttf", robotoRegular);
    pdf.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    pdf.addFileToVFS("Roboto-Bold.ttf", robotoBold);
    pdf.addFont("Roboto-Bold.ttf", "Roboto", "bold");
    pdf.setFont("Roboto", "normal");
}

function metinYaz(
    pdf: jsPDF,
    metin: string,
    x: number,
    y: number,
    genislik: number,
): number {
    const satirlar = pdf.splitTextToSize(metin, genislik);
    pdf.text(satirlar, x, y);
    return y + satirlar.length * 5;
}

export async function generatePdf({
    grants,
    searchTerm,
    threshold,
    totalFound,
}: PdfParams) {
    const pdf = new jsPDF("p", "mm", "a4");
    fontYukle(pdf);

    const sayfaGenisligi = 210;
    const kenar = 20;
    const icerikGenisligi = sayfaGenisligi - kenar * 2;

    // ---- KAPAK ----
    pdf.addImage(logoBase64, "PNG", (sayfaGenisligi - 80) / 2, 20, 80, 80);

    pdf.setFont("Roboto", "bold");
    pdf.setFontSize(20);
    pdf.setTextColor(6, 46, 26);
    pdf.text("FonRadar AI", sayfaGenisligi / 2, 112, { align: "center" });

    pdf.setFontSize(14);
    pdf.text("Fon Analiz Raporu", sayfaGenisligi / 2, 122, { align: "center" });

    pdf.setFont("Roboto", "normal");
    pdf.setFontSize(11);
    pdf.setTextColor(60, 60, 60);

    let y = 145;
    pdf.text(`Arama sorgusu: "${searchTerm}"`, kenar, y);
    y += 7;
    pdf.text(
        `Rapor tarihi: ${new Date().toLocaleDateString("tr-TR")}`,
        kenar,
        y,
    );
    y += 7;
    const lowInReport = grants.filter((g) => g.skor < threshold).length;

    pdf.text(`Toplam bulunan fon: ${totalFound}`, kenar, y);
    y += 7;
    pdf.text(`Rapora dahil edilen: ${grants.length}`, kenar, y);

    if (lowInReport > 0) {
        y += 7;
        pdf.text(
            `Bunlardan ${lowInReport} tanesi ${threshold} puan eşiğinin altında`,
            kenar,
            y,
        );
    }

    if (totalFound > grants.length) {
        y += 7;
        pdf.text(
            `${totalFound - grants.length} fon rapora dahil edilmedi`,
            kenar,
            y,
        );
    }

    // ---- GRAFIKLER ----
    const grafikAlani = document.getElementById("pdf-grafikler");
    if (grafikAlani) {
        const canvas = await html2canvas(grafikAlani, {
            scale: 2,
            backgroundColor: "#ffffff",
        });
        const gorsel = canvas.toDataURL("image/png");
        const oran = canvas.height / canvas.width;
        const gorselYuksekligi = icerikGenisligi * oran;

        pdf.addPage();
        pdf.setFont("Roboto", "bold");
        pdf.setFontSize(14);
        pdf.setTextColor(6, 46, 26);
        pdf.text("Genel Dağılım", kenar, 25);
        pdf.addImage(
            gorsel,
            "PNG",
            kenar,
            32,
            icerikGenisligi,
            Math.min(gorselYuksekligi, 230),
        );
    }

    // ---- HER FON AYRI SAYFA ----
    for (let i = 0; i < grants.length; i++) {
        const fon = grants[i];
        pdf.addPage();
        let ty = 25;

        // Fon numarasi
        pdf.setFont("Roboto", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Fon ${i + 1} / ${grants.length}`, kenar, ty);
        ty += 10;

        // Baslik
        pdf.setFont("Roboto", "bold");
        pdf.setFontSize(15);
        pdf.setTextColor(6, 46, 26);
        ty = metinYaz(
            pdf,
            fon.baslik ?? "Başlık bulunamadı",
            kenar,
            ty,
            icerikGenisligi,
        );
        ty += 6;

        // Skor kutusu
        pdf.setFillColor(...skorRengi(fon.skor));
        pdf.roundedRect(kenar, ty - 5, 45, 12, 2, 2, "F");
        pdf.setFont("Roboto", "bold");
        pdf.setFontSize(11);
        pdf.setTextColor(255, 255, 255);
        pdf.text(`Uygunluk: ${fon.skor}`, kenar + 5, ty + 3);
        ty += 18;

        // Bilgi satirlari
        pdf.setFontSize(11);
        const alanlar: [string, string | null][] = [
            ["Konu", fon.konu],
            ["Kapsam", fon.sehir_durumu],
            ["Hibe Oranı", fon.hibe_orani],
            ["Son Başvuru", fon.son_basvuru],
        ];

        for (const [etiket, deger] of alanlar) {
            pdf.setFont("Roboto", "bold");
            pdf.setTextColor(80, 80, 80);
            pdf.text(`${etiket}:`, kenar, ty);

            pdf.setFont("Roboto", "normal");
            pdf.setTextColor(30, 30, 30);
            pdf.text(temiz(deger), kenar + 35, ty);
            ty += 8;
        }

        ty += 5;

        // Aciklama
        pdf.setFont("Roboto", "bold");
        pdf.setTextColor(80, 80, 80);
        pdf.text("Açıklama:", kenar, ty);
        ty += 7;

        pdf.setFont("Roboto", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(40, 40, 40);
        ty = metinYaz(pdf, temiz(fon.aciklama), kenar, ty, icerikGenisligi);

        // Bagalanti
        if (fon.url && fon.url !== "null") {
            ty += 10;
            pdf.setFontSize(9);
            pdf.setTextColor(37, 99, 235);
            const satirlar = pdf.splitTextToSize(fon.url, icerikGenisligi);
            pdf.textWithLink(satirlar[0], kenar, ty, { url: fon.url });
        }
    }

    pdf.save(`FonRadar-Rapor-${new Date().toLocaleDateString("tr-TR")}.pdf`);
}

function temiz(deger: string | null): string {
    if (!deger || deger === "null" || deger.trim() === "") {
        return "Bilgi bulunamadı";
    }
    return deger;
}

function skorRengi(skor: number): [number, number, number] {
    if (skor >= 85) return [34, 197, 94];
    if (skor >= 70) return [234, 179, 8];
    if (skor >= 50) return [249, 115, 22];
    return [239, 68, 68];
}
