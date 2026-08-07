import type {Grant} from '../types/grant'

type GrantTableProps = {
    grants: Grant[]
}

// Skora göre rozet rengini belirler
function getScoreStyle(score: number): string {
    if (score >= 80) return 'bg-green-100 text-green-800'
    if (score >= 50) return 'bg-amber-100 text-amber-800'
    return 'bg-gray-100 text-gray-600'
}

export function GrantTable({grants}: GrantTableProps) {
    return (
        <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
                <tr>
                    <th className="px-4 py-3 font-medium">Başlık</th>
                    <th className="px-4 py-3 font-medium">Konu</th>
                    <th className="px-4 py-3 font-medium">Hibe Oranı</th>
                    <th className="px-4 py-3 font-medium">Son Başvuru</th>
                    <th className="px-4 py-3 font-medium">Skor</th>
                    <th className="px-4 py-3 font-medium"></th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {grants.map((grant) => (
                    <tr key={grant.url} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">
                            {grant.baslik}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{grant.konu}</td>
                        <td className="px-4 py-3 text-gray-600">{grant.hibe_orani}</td>
                        <td className="px-4 py-3 text-gray-600">{grant.son_basvuru}</td>
                        <td className="px-4 py-3">
                <span
                    className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${getScoreStyle(grant.skor)}`}>
                  {grant.skor}
                </span>
                        </td>
                        <td className="px-4 py-3">
                            <a
                                href={grant.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                İlana git
                            </a>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}