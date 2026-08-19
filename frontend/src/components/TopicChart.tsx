import { PieChart, Pie, ResponsiveContainer, Legend } from "recharts";
import type { Grant } from "../types/Grant.ts";

type TopicChartProps = {
    grants: Grant[];
};

const RENKLER = [
    "#166534",
    "#0369a1",
    "#c2410c",
    "#7c3aed",
    "#0891b2",
    "#be123c",
    "#a16207",
    "#4d7c0f",
];

export function TopicChart({ grants }: TopicChartProps) {
    const sayim = new Map<string, number>();
    for (const item of grants) {
        const konu =
            item.konu && item.konu !== "null" ? item.konu : "Belirtilmemiş";
        sayim.set(konu, (sayim.get(konu) ?? 0) + 1);
    }
    const toplam = grants.length;
    const data = [...sayim.entries()]
        .map(([ad, adet]) => ({
            ad,
            adet,
            yuzde: Math.round((adet / toplam) * 100),
        }))
        .sort((a, b) => b.adet - a.adet)
        .map((item, index) => ({
            ...item,
            fill: RENKLER[index % RENKLER.length],
        }));

    return (
        <div className="flex justify-center">
            <ResponsiveContainer
                width="100%"
                height={500}
                className="print:h-50"
            >
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="adet"
                        nameKey="ad"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        innerRadius={3}
                        strokeWidth={0.75}
                    />
                    <Legend
                        position="bottom"
                        layout="vertical"
                        wrapperStyle={{
                            fontSize: 14,
                            paddingTop: 10,
                            fontWeight: "bold",
                        }}
                        formatter={(value, entry) => {
                            const veri = entry.payload as {
                                adet?: number;
                                yuzde?: number;
                            };
                            return `${value} - ${veri.adet} adet (%${(veri.yuzde || 0).toFixed(0)})`;
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
