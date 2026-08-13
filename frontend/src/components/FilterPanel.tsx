import radar_icon from "../../public/radar_icon.svg"
import {Link} from "react-router-dom";
import type {grant} from "../types/grant.ts";
import logo from "../../public/logo.svg"
import {GrantTable} from "./GrantTable.tsx"

type FilterPanelProps = {
    query: string,
    searchTerm: string,
    onQueryChange: (value: string) => void,
    onSearch: () => void,
    grants: grant[],
    rawCount: number,
    status: 'idle' | 'loading' | 'error' | 'success' | 'empty' | 'lowScore',
    errorMessage: string,
    THRESHOLD: number
}

export function FilterPanel({
                                query,
                                searchTerm,
                                onQueryChange,
                                onSearch,
                                grants,
                                rawCount,
                                status,
                                errorMessage,
                                THRESHOLD,
                            }: FilterPanelProps) {
    function handleSubmit(event: React.FormEvent) {
        event.preventDefault()
        onSearch();
    }

    return (
        <div className="min-h-screen bg-white">
            <div className={`mx-auto max-w-7xl px-6 transition-all ${status !== 'idle' ? 'pt-10' : 'pt-32'}`}>
                <div className="flex items-center justify-center gap-3">
                    <img
                        src={logo}
                        alt="FonRadar AI logosu"
                        className={status !== 'idle' ? 'h-32' : 'h-64'}
                    />
                    <h1 className={`font-bold text-green-950 ${status !== 'idle' ? 'text-5xl' : 'text-7xl'}`}>
                        FonRadar AI
                    </h1>
                </div>
                <div className="mt-8">
                    <form onSubmit={handleSubmit}
                          className="flex gap-3 rounded-full border border-gray-200 bg-white p-4">
                        <img
                            src={radar_icon}
                            alt="FonRadar AI ikonu"
                            className="w-15 h-15 rounded-full"
                        />
                        <input
                            type="text"
                            value={query}
                            onChange={event => onQueryChange(event.target.value)}
                            placeholder="Fonlar içinde ara..."
                            className="flex-1 rounded-full px-3 py-2 text-xl outline-none"
                        />
                        {query !== '' && (
                            <button
                                type="button"
                                onClick={() => onQueryChange('')}
                                aria-label="Aramayı Temizle"
                                className="rounded-full text-gray-600 px-6 py-3 hover:text-gray-600"
                            >
                                X
                            </button>
                        )}
                        <button
                            type="submit"
                            className="rounded-full bg-green-950 px-6 py-3 text-sm font-medium text-white hover:bg-green-800"
                        >
                            Ara
                        </button>
                    </form>
                </div>

                {status === 'idle' && (
                    <div className="mt-6 text-center">
                        <Link
                            to="/admin"
                            className="inline-block shadow-inner rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            Tüm Fonları Görüntüle
                        </Link>
                    </div>
                )}

                {status !== 'idle' && (
                    <div className="mt-18 pb-12">
                        {status === 'loading' && (
                            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                                <p className="text-gray-600">Fonlar analiz ediliyor, bu biraz zaman alabilir...</p>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
                                <p className="text-red-700">{errorMessage}</p>
                            </div>
                        )}

                        {status === 'success' && (
                            <div>
                                <span
                                    className="mb-6 px-4 border-3 border-gray-200 text-md text-green-950 font-bold ">
                                    {grants.length} sonuç bulundu
                                </span>
                                <div className="bg-white">
                                    <GrantTable grants={grants}/>
                                </div>
                            </div>
                        )}

                        {status === 'empty' && (
                            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                                <p className="text-red-600">
                                    "{searchTerm}" ile eşleşen fon bulunamadı.
                                </p>
                            </div>
                        )}

                        {status === 'lowScore' && (
                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-8 text-center">
                                <p className="text-amber-800">
                                    "{searchTerm}" için {rawCount} fon bulundu, ancak hiçbirinin uygunluk
                                    skoru {THRESHOLD} eşiğini geçmedi.
                                </p>
                                <p className="mt-2 text-sm text-amber-700">
                                    Aramanızı farklı kelimelerle deneyebilirsiniz.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}