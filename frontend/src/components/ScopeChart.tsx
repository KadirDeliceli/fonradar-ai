import { PieChart, Pie, ResponsiveContainer } from "recharts";
import type { Grant } from "../types/Grant.ts";

type ScopeChartProps = {
    grants: Grant[];
};

const RENKLER = [
    "#14532d",
    "#166534",
    "#15803d",
    "#22c55e",
    "#4ade80",
    "#86efac",
    "#cffaf2",
];

export function ScopeChart({ grants }: ScopeChartProps) {
    const sayim = new Map<string, number>();
    for (const item of grants) {
        const kapsam =
            item.sehir_durumu && item.sehir_durumu !== "null"
                ? item.sehir_durumu
                : "Belirtilmemiş";
        sayim.set(kapsam, (sayim.get(kapsam) ?? 0) + 1);
    }
    const data = [...sayim.entries()]
        .map(([ad, adet], index) => ({
            ad,
            adet,
            fill: RENKLER[index % RENKLER.length],
        }))
        .sort((a, b) => b.adet - a.adet);

    return (
        <div className="flex justify-center">
            <ResponsiveContainer
                width="100%"
                height={400}
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
                        label={({ name, percent, value }) =>
                            `${name}  (%${((percent || 0) * 100).toFixed(0)}, ${value} adet)`
                        }
                        fontSize={14}
                        fontWeight="bold"
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
