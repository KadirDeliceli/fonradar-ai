import type { grant } from "../types/grant.ts";

type GrantTableProps = {
    grants: grant[];
};

function getScoreStyle(score: number): string {
    if (score >= 85) return "bg-green-500 text-green-950";
    if (score >= 70) return "bg-yellow-500 text-yellow-950";
    if (score >= 50) return "bg-orange-500 text-orange-950";
    return "bg-red-500 text-red-950";
}

export function GrantTable({ grants }: GrantTableProps) {
    return (
        <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
                    <tr>
                        <th className="px-4 py-3 font-medium w-[7%] whitespace-nowrap">
                            Fon ID
                        </th>
                        <th className="px-4 py-3 font-medium w-[26%]">
                            Başlık
                        </th>
                        <th className="px-4 py-3 font-medium w-[13%]">Konu</th>
                        <th className="px-4 py-3 font-medium w-[26%]">
                            Açıklama
                        </th>
                        <th className="px-4 py-3 font-medium w-[10%] whitespace-nowrap">
                            Hibe Oranı
                        </th>
                        <th className="px-4 py-3 font-medium w-[9%] whitespace-nowrap">
                            Son Başvuru
                        </th>
                        <th className="px-4 py-3 font-medium w-[4.5%]">Skor</th>
                        <th className="px-4 py-3 font-medium w-[4.5%]"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {grants.map((grant, index) => (
                        <tr
                            key={`${grant.baslik}-${index}`}
                            className="hover:bg-gray-50"
                        >
                            <td className="px-4 py-3 text-gray-600">
                                {index + 1}
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-900">
                                {grant.baslik === null ||
                                grant.baslik === "null"
                                    ? "Bilgi Bulunamadı"
                                    : grant.baslik}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                                {grant.konu === null || grant.konu === "null"
                                    ? "Bilgi Bulunamadı"
                                    : grant.konu}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                                <span title={grant.aciklama ?? ""}>
                                    {grant.aciklama === null ||
                                    grant.aciklama === "null"
                                        ? "Bilgi Bulunamadı"
                                        : grant.aciklama}
                                </span>
                            </td>
                            <td className="pl-4 py-3 text-gray-600">
                                {grant.hibe_orani ?? "Bilgi Bulunamadı"}
                            </td>
                            <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                                {grant.son_basvuru === null ||
                                grant.son_basvuru === "null"
                                    ? "Bilgi Bulunamadı"
                                    : grant.son_basvuru}
                            </td>
                            <td className="px-4 py-3">
                                <span
                                    className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${getScoreStyle(grant.skor)}`}
                                >
                                    {grant.skor}
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                {grant.url && grant.url !== "null" ? (
                                    <a
                                        href={grant.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        İlana git
                                    </a>
                                ) : (
                                    <span className="text-red-600 cursor-not-allowed">
                                        İlan bulunamadı
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
