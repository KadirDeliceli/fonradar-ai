import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import type { Grant } from "../types/Grant";

type ScoreChartProps = {
    grants: Grant[];
};

function getBarColor(score: number): string {
    if (score >= 85) return "#22c55e";
    if (score >= 70) return "#eab308";
    if (score >= 50) return "#f97316";
    return "#ef4444";
}

function ColeredBar(props: any) {
    const { x, y, width, height, payload } = props;
    return (
        <rect
            x={x}
            y={y}
            width={width}
            height={height}
            rx={10}
            fill={getBarColor(payload.skor)}
        />
    );
}

export function ScoreChart({ grants }: ScoreChartProps) {
    const data = grants.map((item) => ({
        ad: item.baslik ?? "Bilinmeyen",
        skor: item.skor,
    }));

    return (
        <ResponsiveContainer width="100%" height={data.length * 100 + 10}>
            <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 20, left: -40, right: 0, bottom: 5 }}
            >
                <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    vertical={true}
                    stroke="oklch(70.7% 0.022 261.325)"
                />
                <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 15, fill: "#374151" }}
                    axisLine={{ stroke: "oklch(92.8% 0.006 264.531)" }}
                    tickLine={false}
                />
                <YAxis
                    type="category"
                    dataKey="ad"
                    width={350}
                    tick={{ fontSize: 15, fill: "#374151" }}
                    axisLine={{ stroke: "oklch(92.8% 0.006 264.531)" }}
                    tickLine={false}
                />
                <Bar dataKey="skor" shape={<ColeredBar />} barSize={40} />
            </BarChart>
        </ResponsiveContainer>
    );
}
