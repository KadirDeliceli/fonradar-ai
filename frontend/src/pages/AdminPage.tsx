import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { StatusMessage } from "../components/StatusMessage.tsx";
import type { RawGrant } from "../types/RawGrant.ts";
import { RawGrantTable } from "../components/RawGrantTable.tsx";
import { fetchAllGrant } from "../api/grantApi.ts";

export function AdminPage() {
    const [grants, setGrants] = useState<RawGrant[]>([]);
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
                const message =
                    err instanceof Error
                        ? err.message
                        : "Beklenmeyen bir hata oluştu.";
                setErrorMessage(message);
                setStatus("error");
            }
        }

        void loadGrants();
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
                            <div className="overflow-hidden rounded-lg border border-gray-200 mt-6">
                                <div className="border-b border-gray-200 bg-gray-50 py-5 text-center">
                                    <h1 className="font-semibold text-gray-700">
                                        Tüm Kazınan Fon Listesi
                                    </h1>
                                </div>
                                <RawGrantTable grants={grants} />
                            </div>
                        </div>
                    )}
                    {status === "empty" && (
                        <StatusMessage tone="warning">
                            Kazınan fon listesi boş.
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
