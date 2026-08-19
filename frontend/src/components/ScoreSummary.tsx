import type { Grant } from "../types/Grant.ts";

type ScoreSummaryProps = {
    grants: Grant[];
};

export function ScoreSummary({ grants }: ScoreSummaryProps) {
    const yuksek = grants.filter((g) => g.skor >= 85).length;
    const orta = grants.filter((g) => g.skor >= 70 && g.skor < 85).length;
    const dusuk = grants.filter((g) => g.skor >= 50 && g.skor < 70).length;
    const cokDusuk = grants.filter((g) => g.skor < 50).length;

    const kartlar = [
        {
            etiket: "Yüksek Uygunluk",
            deger: yuksek,
            aralik: "85+",
            stil: "border-green-200 bg-green-200 text-green-800",
        },
        {
            etiket: "Orta Uygunluk",
            deger: orta,
            aralik: "70-84",
            stil: "border-yellow-200 bg-yellow-200 text-yellow-800",
        },
        {
            etiket: "Düşük Uygunluk",
            deger: dusuk,
            aralik: "50-69",
            stil: "border-orange-200 bg-orange-200 text-orange-800",
        },
        {
            etiket: "Uygunsuz",
            deger: cokDusuk,
            aralik: "<50",
            stil: "border-red-200 bg-red-200 text-red-800",
        },
    ];

    return (
        <div className="w-45">
            {kartlar.map((kart) => (
                <div
                    key={kart.etiket}
                    className={`rounded-lg border text-center ${kart.stil}`}
                >
                    <div className="text-3xl font-bold">{kart.deger}</div>
                    <div className="text-sm font-medium">{kart.etiket}</div>
                    <div className="text-xs font-light pb-1.5">
                        {kart.aralik} puan
                    </div>
                </div>
            ))}
        </div>
    );
}
