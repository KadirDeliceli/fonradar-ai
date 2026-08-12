import {AdminPanelGrantTable} from './components/AdminPanelGrantTable.tsx'
import {generatedMockGrants} from "./data/mockFilteredGrantGenerator.ts";

export function AdminPanelApp() {
    return (
        <div className="mt-12 pb-12">
            {generatedMockGrants.length > 0 ? (
                <div>
                    <span
                        className="mb-6 px-4 border-3 border-gray-200 text-md text-green-950 font-bold ">
                        {generatedMockGrants.length} sonuç bulundu
                    </span>
                    <div className="bg-white">
                        <AdminPanelGrantTable grants={generatedMockGrants}/>
                    </div>
                </div>
            ) : (
                <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                    <p className="text-red-600">
                        Kazınan fon listesi boş!
                    </p>
                </div>
            )}
        </div>
    )
}
