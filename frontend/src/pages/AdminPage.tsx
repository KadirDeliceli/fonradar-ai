import {Link} from "react-router-dom"
import {AdminPanel} from "../components/AdminPanel.tsx"

export function AdminPage(){
    return(
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl px-6 pt-10">
                <Link to="/" className="mb-6 inline-block text-sm text-blue-600 hover:underline">
                    ← Aramaya dön
                </Link>
                <AdminPanel/>
            </div>
        </div>
    )
}