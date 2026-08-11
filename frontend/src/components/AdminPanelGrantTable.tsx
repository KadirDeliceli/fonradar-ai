import type {nonFilteredGrant} from '../types/nonFilteredGrant.ts'

type GrantTableProps = {
    grants: nonFilteredGrant[]
}

export function AdminPanelGrantTable({grants}: GrantTableProps) {
    return (
        <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
                <tr>
                    <th className="px-4 py-3 font-medium">Fon ID</th>
                    <th className="px-4 py-3 font-medium">Başlık</th>
                    <th className="px-4 py-3 font-medium"></th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {grants.map((grant, index) => (
                        <tr key={grant.url} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                            <td className="px-4 py-3 font-medium text-gray-900">
                                {(grant.baslik === null) || (grant.baslik === "null") ? "Bilgi Bulunamadı" : grant.baslik}
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