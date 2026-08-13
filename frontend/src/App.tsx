import {Routes, Route} from "react-router-dom"
import {SearchPage} from "./pages/SearchPage.tsx"
import {AdminPage} from "./pages/AdminPage.tsx"
import {StrictMode} from "react";

function App() {
    return (
        <StrictMode>
            <Routes>
                <Route path="/" element={<SearchPage/>}/>
                <Route path="/admin" element={<AdminPage/>}/>
            </Routes>
        </StrictMode>
    )
}
export default App