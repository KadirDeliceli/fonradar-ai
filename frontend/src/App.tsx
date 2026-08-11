import {useState} from 'react'
import {FilterPanel} from "./components/FilterPanel.tsx";
import {GrantTable} from "./components/GrantTable.tsx";
import {generatedMockGrants} from "./data/mockFilteredGrantGenerator.ts";
import logo from "../public/logo.svg"

function App() {
    const [query, setQuery] = useState('')

    const hasSearch = query.trim() !== ''

    const filteredGrants = generatedMockGrants.filter((grant) => {
        const searchText = [grant.baslik, grant.konu, grant.aciklama]
            .filter((field) => field != null && field != 'null')
            .join(' ')
            .toLocaleLowerCase('tr')
        return searchText.includes(query.toLocaleLowerCase('tr'))
    })
    return (
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
                        onQueryChange={setQuery}
                    />
                </div>

                {!hasSearch && (
                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            className="shadow-inner rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            Tüm Fonları Görüntüle
                        </button>
                    </div>
                )}

                {hasSearch && (
                    <div className="mt-6 pb-12">
                        <p className="mb-3 text-sm text-gray-500 ">
                            {filteredGrants.length} sonuç bulundu
                        </p>
                        {filteredGrants.length > 0 ? (
                            <div className="bg-white">
                                <GrantTable grants={filteredGrants}/>
                            </div>
                        ) : (
                            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                                <p className="text-green-950">Aramanızla eşleşen fon bulunamadı.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )

}

export default App
