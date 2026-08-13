import {RawGrantTable} from './RawGrantTable.tsx'
import {Link} from "react-router-dom";
import type {rawGrant} from "../types/rawGrant.ts";

interface AdminPanelProps {
    errorMessage: string,
    grants: rawGrant[]
    status: 'loading' | 'error' | 'success' | 'empty'
}

export function AdminPanel( {grants, status, errorMessage}: AdminPanelProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl px-6 pt-10 pb-12">
                <Link to="/" className="mb-6 inline-block text-sm text-blue-600 hover:underline">
                    ← Aramaya dön
                </Link>

                <h2 className="text-2xl font-bold text-green-950">Tüm Fonlar</h2>
                <p className="mt-1 text-sm text-gray-500">Kazınmış ham fon listesi</p>

                <div className="mt-12 pb-12">
                    {status === 'loading' && (
                        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                            <p className="text-gray-600">Fonlar yükleniyor...</p>
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
                            <p className="text-red-700">{errorMessage}</p>
                        </div>
                    )}
                    {status === 'success' && (
                        <div>
                            <span className="mb-6 px-4 border-3 border-gray-200 text-md text-green-950 font-bold">
                            {grants.length} sonuç bulundu.
                            </span>
                            <RawGrantTable grants={grants}/>
                        </div>
                    )}
                    {status === 'empty' && (
                        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                            <p className="text-red-600">
                                Kazınan fon listesi boş!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
