import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { StatusMessage } from "../components/StatusMessage.tsx";
import type { rawGrant } from "../types/rawGrant.ts";
import { RawGrantTable } from "../components/RawGrantTable.tsx";
import { fetchAllGrant } from "../api/grantApi.ts";

export function AdminPage() {
    const [grants, setGrants] = useState<rawGrant[]>([]);
    const [status, setStatus] = useState<
        "loading" | "error" | "success" | "empty"
    >("loading");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function loadGrants() {
            try {
                const results = await fetchAllGrant();
                setGrants(results);
                setStatus(results.length > 0 ? "success" : "empty");
            } catch (err) {
                setErrorMessage(
                    "Fon listesi alınamadı. Sunucunun çalıştığından emin olun.",
                );
                setStatus("error");
            }
        }

        loadGrants();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto max-w-7xl px-6 pt-10 pb-12">

                <div className="mt-18 pb-12">
                    {status === "loading" && (
                        <StatusMessage>Fonlar Yükleniyor...</StatusMessage>
                    )}
                    {status === "error" && (
                        <StatusMessage tone="error">
                            {errorMessage}
                        </StatusMessage>
                    )}
                    {status === "success" && (
                        <div>
                            <StatusMessage>
                                {grants.length} sonuç bulundu.
                            </StatusMessage>
                            <div className="bg-white p-6 ">
                                <RawGrantTable grants={grants} />
                            </div>
                        </div>
                    )}
                    {status === "empty" && (
                        <StatusMessage tone="error">
                            kazınan fon listesi boş.
                        </StatusMessage>
                    )}
                </div>
                <div className="mt-6 text-center">
                    <Link
                        to="/"
                        className="inline-block shadow-inner rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:underline"
                    >
                        ← Aramaya dön
                    </Link>
                </div>
            </div>
        </div>
    );
}
