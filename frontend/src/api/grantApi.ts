import type { Grant, MatchScoreResponse } from "../types/Grant.ts";
import type { RawGrant, FetchedGrantsResponse } from "../types/RawGrant.ts";
import { mockGrants, mockRawGrants } from "../data/mockGrants.ts";

const API_BASE_URL = "http://127.0.0.1:8000";

// Görsel geliştirme aşamasında testler için flag eklendi. Commit etmeden önce false yapılacak.

const USE_MOCK = false;
type AdminScenario = "normal" | "bos" | "hata" | "tek" | "kirli" | "cok";
const ADMIN_SCENARIO: AdminScenario = "hata";

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchMatchedGrants(query: string): Promise<Grant[]> {
    if (USE_MOCK) {
        await delay(1200);
        const test = query.trim().toLocaleLowerCase("tr");

        if (test === "hata") {
            throw new Error(
                "Analiz servisi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.",
            );
        }
        if (test === "bos") {
            return [];
        }
        if (test === "dusuk") {
            return mockGrants.map((g) => ({ ...g, skor: 30 }));
        }
        if (test === "tek") {
            return [mockGrants[0]];
        }
        if (test === "kirli") {
            return mockGrants.map((g) => ({
                ...g,
                baslik: null,
                url: null,
                konu: null,
                son_basvuru: null,
                hibe_orani: null,
            }));
        }
        return mockGrants;
    }

    let response: Response;

    try {
        response = await fetch(
            `${API_BASE_URL}/match-score?sorgu=${encodeURIComponent(query.trim())}`,
        );
    } catch {
        throw new Error(
            "Sunucuya bağlanılamadı. Sunucunun çalıştığından emin olun.",
        );
    }

    if (!response.ok) {
        throw new Error(
            `Sunucu isteği işleyemedi. Lütfen daha sonra tekrar deneyin. (HTTP: ${response.status})`,
        );
    }

    const data: MatchScoreResponse = await response.json();

    if (data.durum !== "basarili") {
        throw new Error(
            "Analiz servisi şu anda yanıt vermiyor. Lütfen daha sonra tekrar deneyin.",
        );
    }

    return data.sonuclar;
}

export async function fetchAllGrant(): Promise<RawGrant[]> {
    if (USE_MOCK) {
        await delay(500);

        if (ADMIN_SCENARIO === "hata") {
            throw new Error("Test hatası");
        }
        if (ADMIN_SCENARIO === "bos") {
            return [];
        }
        if (ADMIN_SCENARIO === "tek") {
            return [mockRawGrants[0]];
        }
        if (ADMIN_SCENARIO === "kirli") {
            return mockRawGrants.map((g) => ({
                ...g,
                baslik: null,
                url: null,
            }));
        }
        if (ADMIN_SCENARIO === "cok") {
            return Array.from({ length: 25 }, (_, i) => ({
                baslik: `${1500 + i} - Örnek Destek Programı ${i + 1}`,
                url: `https://tubitak.gov.tr/ornek-${i + 1}`,
            }));
        }
        return mockRawGrants;
    }

    let response: Response;

    try {
        response = await fetch(`${API_BASE_URL}/fetch-grants`);
    } catch {
        throw new Error(
            "Sunucuya bağlanılamadı. Sunucunun çalıştığından emin olun.",
        );
    }
    if (!response.ok) {
        throw new Error(
            `Sunucu isteği işleyemedi. Lütfen daha sonra tekrar deneyin. (HTTP, ${response.status}"`,
        );
    }
    const data: FetchedGrantsResponse = await response.json();
    return data.fonlar;
}
