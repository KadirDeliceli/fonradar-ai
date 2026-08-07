import { GrantTable } from './components/GrantTable'
import { mockGrants } from './data/mockGrants'

function App() {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-5xl">
                <h1 className="text-2xl font-bold text-gray-900">FonRadar AI</h1>
                <p className="mt-1 text-sm text-gray-500">
                    {mockGrants.length} fon listeleniyor
                </p>
                <div className="mt-6 bg-white">
                    <GrantTable grants={mockGrants} />
                </div>
            </div>
        </div>
    )
}

export default App