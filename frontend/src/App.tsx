import { Routes, Route } from "react-router-dom";
import { SearchPage } from "./pages/SearchPage.tsx";
import { AdminPage } from "./pages/AdminPage.tsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/admin" element={<AdminPage />} />
        </Routes>
    );
}
export default App;
