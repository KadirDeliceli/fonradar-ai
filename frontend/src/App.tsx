import {useState} from 'react'
import {FilterPanel} from "./components/FilterPanel.tsx";
import {GrantTable} from "./components/GrantTable.tsx";
import {generatedMockGrants} from "./data/mockFilteredGrantGenerator.ts";
import logo from "../public/logo.svg"
import {AdminPanelApp} from "./AdminPanelApp.tsx";

function App() {
    const [query, setQuery] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [view, setView] = useState<'search' | 'admin'>('search')

    const hasSearch = searchTerm.trim() !== ''

    function handleSearch() {
        setSearchTerm(query)
    }
    function handleQueryChange(value:string) {
        setQuery(value)
        if (value.trim() === '') {
            setSearchTerm('')
        }
    }

    const filteredGrants = generatedMockGrants.filter((grant) => {
        const searchText = [grant.baslik, grant.konu, grant.aciklama]
            .filter((field) => field != null && field != 'null')
            .join(' ')
            .toLocaleLowerCase('tr')
        return searchText.includes(searchTerm.toLocaleLowerCase('tr'))
    })
    return(
        (view === 'admin') ?
            (
                <div className="min-h-screen bg-gray-50">
                    <div className="mx-auto max-w-7xl px-6 pt-10">
                        <button
                            type="button"
                            onClick={() => setView('search')}
                            className="mb-6 text-sm text-blue-600 hover:underline"
                        >
                            ← Aramaya dön
                        </button>

                        <AdminPanelApp/>
                    </div>
                </div>
            )
        : (
            <div className="min-h-screen bg-white">
                <div className={`mx-auto max-w-7xl px-6 transition-all ${hasSearch ? 'pt-10' : 'pt-32'}`}>
                    <div className="flex items-center justify-center gap-3">
                        <img
                            src={logo}
                            alt="FonRadar AI logosu"
                            className={hasSearch ? 'h-32' : 'h-64'}
                        />
                        <h1 className={`font-bold text-green-950 ${hasSearch ? 'text-5xl' : 'text-7xl'}`}>
                            FonRadar AI
                        </h1>
                    </div>
                    <div className="mt-8">
                        <FilterPanel
                            query={query}
                            onSearch={handleSearch}
                            onQueryChange={handleQueryChange}
                        />
                    </div>

                    {!hasSearch && (
                        <div className="mt-6 text-center">
                            <button
                                type="button"
                                onClick={() => {setView('admin')}}
                                className="shadow-inner rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                                Tüm Fonları Görüntüle
                            </button>
                        </div>
                    )}

                    {hasSearch && (
                        <div className="mt-18 pb-12">
                            {filteredGrants.length > 0 ? (
                                <div>
                                    <span className="mb-6 px-4 border-3 border-gray-200 text-md text-green-950 font-bold ">
                                        {filteredGrants.length} sonuç bulundu
                                    </span>
                                    <div className="bg-white">
                                        <GrantTable grants={filteredGrants}/>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                                    <p className="text-red-600">
                                        "{searchTerm}" ile eşleşen fon bulunamadı.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        )
    )
}

export default App
