import { useState } from "react";
import { Link } from "react-router-dom";
import { fetchMatchedGrants } from "../api/grantApi.ts";
import type { Grant } from "../types/Grant.ts";
import { BrandLogo } from "../components/BrandLogo.tsx";
import { QueryPanel } from "../components/QueryPanel.tsx";
import { StatusMessage } from "../components/StatusMessage.tsx";
import { GrantTable } from "../components/GrantTable.tsx";

const THRESHOLD = 50;

export function SearchPage() {
    const [query, setQuery] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [grants, setGrants] = useState<Grant[]>([]);
    const [allGrants, setAllGrants] = useState<Grant[]>([]);
    const [showAll, setShowAll] = useState(false);
    const [rawCount, setRawCount] = useState(0);
    const [status, setStatus] = useState<
        "idle" | "loading" | "error" | "success" | "empty" | "lowScore"
    >("idle");
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSearch() {
        if (query.trim() === "") return;
        setSearchTerm(query);
        setStatus("loading");
        setErrorMessage("");
        setShowAll(false);
        try {
            const results = await fetchMatchedGrants(query);
            const sorted = [...results].sort((a, b) => b.skor - a.skor);
            const highScored = sorted.filter((item) => item.skor >= THRESHOLD);

            setAllGrants(sorted);
            setGrants(highScored);
            setRawCount(results.length);

            if (highScored.length > 0) {
                setStatus("success");
            } else if (results.length > 0) {
                setStatus("lowScore");
            } else {
                setStatus("empty");
            }
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Beklenmeyen bir hata oluştu.";
            setErrorMessage(message);
            setGrants([]);
            setAllGrants([]);
            setStatus("error");
        }
    }

    function handleQueryChange(value: string) {
        setQuery(value);
        if (value.trim() === "") {
            setStatus("idle");
            setGrants([]);
            setAllGrants([]);
            setShowAll(false);
            setSearchTerm("");
            setErrorMessage("");
        }
    }

    return (
        <div className="min-h-screen bg-white">
            <div
                className={`mx-auto max-w-7xl px-6 transition-all ${status !== "idle" ? "pt-10" : "pt-32"}`}
            >
                <BrandLogo compact={status !== "idle"} />
                <div className="mt-8">
                    <QueryPanel
                        query={query}
                        onQueryChange={handleQueryChange}
                        onSearch={handleSearch}
                    />
                </div>

                {status === "idle" && (
                    <div className="mt-6 text-center">
                        <Link
                            to="/admin"
                            className="inline-block shadow-inner rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:underline"
                        >
                            Tüm Fonları Görüntüle
                        </Link>
                    </div>
                )}

                {status !== "idle" && (
                    <div className="mt-18 pb-12">
                        {status === "loading" && (
                            <StatusMessage>
                                Fonlar analiz ediliyor, bu biraz zaman
                                alabilir...
                            </StatusMessage>
                        )}
                        {status === "error" && (
                            <StatusMessage tone="error">
                                {errorMessage}
                            </StatusMessage>
                        )}

                        {status === "success" && (
                            <div>
                                <StatusMessage>
                                    <p>
                                        {showAll
                                            ? allGrants.length
                                            : grants.length}{" "}
                                        sonuç bulundu.
                                    </p>
                                    {rawCount > grants.length && (
                                        <div className="mt-3 text-center">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowAll(!showAll)
                                                }
                                                className="inline-block shadow-inner rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:underline"
                                            >
                                                {showAll
                                                    ? "Sadece uygun fonları göster"
                                                    : `Skoru düşük ${rawCount - grants.length} fonu da göster`}
                                            </button>
                                        </div>
                                    )}
                                </StatusMessage>
                                <div className="bg-white p-6 ">
                                    <GrantTable
                                        grants={showAll ? allGrants : grants}
                                    />
                                </div>
                            </div>
                        )}

                        {status === "empty" && (
                            <StatusMessage tone="warning">
                                "{searchTerm}" ile eşleşen fon bulunamadı.
                            </StatusMessage>
                        )}

                        {status === "lowScore" && (
                            <div>
                                <StatusMessage tone="warning">
                                    <p>
                                        "{searchTerm}" için {rawCount} fon
                                        bulundu, ancak hiçbirinin uygunluk skoru{" "}
                                        {THRESHOLD} eşiğini geçmedi.
                                    </p>
                                    <p className="mt-2 text-sm">
                                        Aramanızı farklı kelimelerle
                                        deneyebilirsiniz.
                                    </p>
                                    <div className="mt-3 text-center">
                                        <button
                                            type="button"
                                            onClick={() => setShowAll(!showAll)}
                                            className="inline-block shadow-inner rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:underline"
                                        >
                                            {showAll
                                                ? "Sonuçları gizle"
                                                : `Yine de ${rawCount} fonu göster`}
                                        </button>
                                    </div>
                                </StatusMessage>
                                {showAll && (
                                    <div className="bg-white p-6">
                                        <GrantTable grants={allGrants} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
