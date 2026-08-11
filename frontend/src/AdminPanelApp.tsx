import { AdminPanelGrantTable } from './components/AdminPanelGrantTable.tsx'
import {generatedMockGrants} from "./data/mockFilteredGrantGenerator.ts";

export function AdminPanelApp() {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-7xl">
                <p className="mt-1 mx-2 text-sm text-gray-700">
                    {generatedMockGrants.length} fon listeleniyor...
                </p>
                <div className="mt-1 bg-white">
                    <AdminPanelGrantTable grants={generatedMockGrants} />
                </div>
            </div>
        </div>
    )
}
