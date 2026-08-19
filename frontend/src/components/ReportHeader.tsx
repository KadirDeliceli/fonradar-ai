type ReportHeaderProps = {
    searchTerm: string;
    count: number;
    hiddenCount: number;
    threshold: number;
};

export function ReportHeader({
    searchTerm,
    count,
    hiddenCount,
    threshold,
}: ReportHeaderProps) {
    return (
        <div className="hidden print:block mb-8 border-b border-gray-300 pb-4">
            <h1 className="text-2xl font-bold text-green-950">
                FonRadar AI — Fon Analiz Raporu
            </h1>
            <p className="mt-2 text-sm text-gray-600">
                Arama sorgusu: "{searchTerm}"
            </p>
            <p className="text-sm text-gray-600">
                Rapor tarihi: {new Date().toLocaleDateString("tr-TR")}
            </p>
            <p className="text-sm text-gray-600">
                {count} fon listeleniyor
                {hiddenCount > 0 &&
                    ` (${hiddenCount} fon ${threshold} puan eşiğinin altında)`}
            </p>
        </div>
    );
}
