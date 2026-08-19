import { useState } from "react";
import { Link } from "react-router-dom";
import { fetchMatchedGrants } from "../api/grantApi.ts";
import type { Grant } from "../types/Grant.ts";
import { BrandLogo } from "../components/BrandLogo.tsx";
import { QueryPanel } from "../components/QueryPanel.tsx";
import { StatusMessage } from "../components/StatusMessage.tsx";
import { GrantTable } from "../components/GrantTable.tsx";
import { ScoreChart } from "../components/ScoreChart.tsx";
import { TopicChart } from "../components/TopicChart.tsx";
import { ScoreSummary } from "../components/ScoreSummary.tsx";
import { ScopeChart } from "../components/ScopeChart.tsx";
import { generatePdf } from "../utils/generatePdf.ts";

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
    const [pdfIncludeLow, setPdfIncludeLow] = useState(false);

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

    function handlePdf() {
        void generatePdf({
            grants: pdfIncludeLow ? allGrants : grants,
            searchTerm,
            threshold: THRESHOLD,
            totalFound: rawCount,
        });
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
                                </div>
                                <div id="pdf-grafikler">
                                    <div className="mt-6 py-15 grid grid-cols-1 gap-16">
                                        <TopicChart
                                            grants={
                                                showAll ? allGrants : grants
                                            }
                                        />
                                        <ScopeChart
                                            grants={
                                                showAll ? allGrants : grants
                                            }
                                        />
                                    </div>
                                    <div className="mt-6 grid grid-cols-4 gap-6 items-center">
                                        <div className="col-span-3">
                                            <ScoreChart
                                                grants={
                                                    showAll ? allGrants : grants
                                                }
                                            />
                                        </div>
                                        <div>
                                            <ScoreSummary
                                                grants={
                                                    showAll ? allGrants : grants
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-15">
                                    <GrantTable
                                        grants={showAll ? allGrants : grants}
                                    />
                                </div>
                                <div className="mt-4 flex items-center justify-center gap-4">
                                    <button
                                        type="button"
                                        onClick={handlePdf}
                                        className="rounded-full bg-green-950 px-6 py-3 text-sm font-medium text-white hover:bg-green-800"
                                    >
                                        Raporu PDF olarak indir
                                    </button>

                                    {rawCount > grants.length && (
                                        <label className="flex items-center gap-2 text-sm text-gray-600">
                                            <input
                                                type="checkbox"
                                                checked={pdfIncludeLow}
                                                onChange={(event) =>
                                                    setPdfIncludeLow(
                                                        event.target.checked,
                                                    )
                                                }
                                                className="h-4 w-4 rounded border-gray-300"
                                            />
                                            Eşik altı fonları da rapora ekle
                                        </label>
                                    )}
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
                                <div>
                                    <StatusMessage tone="warning">
                                        <p>
                                            "{searchTerm}" için {rawCount} fon
                                            bulundu, ancak hiçbirinin uygunluk
                                            skoru {THRESHOLD} eşiğini geçmedi.
                                        </p>
                                        <p className="mt-2 text-sm">
                                            Aramanızı farklı kelimelerle
                                            deneyebilirsiniz.
                                        </p>
                                        <div className="mt-3 text-center">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowAll(!showAll)
                                                }
                                                className="inline-block shadow-inner rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:underline"
                                            >
                                                {showAll
                                                    ? "Sonuçları gizle"
                                                    : `Yine de ${rawCount} fonu göster`}
                                            </button>
                                        </div>
                                    </StatusMessage>
                                </div>
                                {showAll && (
                                    <div>
                                        <div id="pdf-grafikler">
                                            <div className="mt-6 py-15 grid grid-cols-1 gap-6">
                                                <TopicChart
                                                    grants={
                                                        showAll
                                                            ? allGrants
                                                            : grants
                                                    }
                                                />
                                                <ScopeChart
                                                    grants={
                                                        showAll
                                                            ? allGrants
                                                            : grants
                                                    }
                                                />
                                            </div>
                                            <div className="mt-6 grid grid-cols-4 gap-6">
                                                <div className="col-span-3">
                                                    <ScoreChart
                                                        grants={
                                                            showAll
                                                                ? allGrants
                                                                : grants
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <ScoreSummary
                                                        grants={
                                                            showAll
                                                                ? allGrants
                                                                : grants
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-6 py-15">
                                            <GrantTable grants={allGrants} />
                                        </div>
                                        <div className="mt-4 flex items-center justify-center gap-4">
                                            <button
                                                type="button"
                                                onClick={handlePdf}
                                                className="rounded-full bg-green-950 px-6 py-3 text-sm font-medium text-white hover:bg-green-800"
                                            >
                                                Raporu PDF olarak indir
                                            </button>

                                            {rawCount > grants.length && (
                                                <label className="flex items-center gap-2 text-sm text-gray-600">
                                                    <input
                                                        type="checkbox"
                                                        checked={pdfIncludeLow}
                                                        onChange={(event) =>
                                                            setPdfIncludeLow(
                                                                event.target
                                                                    .checked,
                                                            )
                                                        }
                                                        className="h-4 w-4 rounded border-gray-300"
                                                    />
                                                    Eşik altı fonları da rapora
                                                    ekle
                                                </label>
                                            )}
                                        </div>
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
