import type {rawGrant} from '../types/rawGrant.ts'

type GrantTableProps = {
    grants: rawGrant[]
}

export function RawGrantTable({grants}: GrantTableProps) {
    return (
        <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
                    <tr>
                        <th className="px-4 py-3 font-medium w-[6%]">Fon ID</th>
                        <th className="px-4 py-3 font-medium w-[76%]">Başlık</th>
                        <th className="px-4 py-3 font-medium w-[18%] whitespace-nowrap"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {grants.map((grant, index) => (
                            <tr key={grant.url ?? index} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                                <td className="px-4 py-3 font-medium text-gray-900">
                                    {(grant.baslik === null)  ? "Bilgi Bulunamadı" : grant.baslik}
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
    )
}