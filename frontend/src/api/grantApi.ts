import type { grant, MatchScoreResponse } from "../types/grant.ts";
import type { rawGrant, FetchedGrantsResponse } from "../types/rawGrant.ts";
import { mockGrants, mockRawGrants } from "../data/mockGrants.ts";

const API_BASE_URL = "http://127.0.0.1:8000";

// Görsel geliştirme aşamasında testler için flag eklendi. Commit etmeden önce false yapılacak.

const USE_MOCK = true;

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchMatchedGrants(query: string): Promise<grant[]> {
    if (USE_MOCK) {
        await delay(1200)
        const test = query.trim().toLocaleLowerCase('tr')

        if (test === 'hata') {
            throw new Error('Test hatası')
        }
        if (test === 'bos') {
            return []
        }
        if (test === 'dusuk') {
            return mockGrants.map((g) => ({ ...g, skor: 30 }))
        }
        if (test === 'tek') {
            return [mockGrants[0]]
        }
        if (test === 'kirli') {
            return mockGrants.map((g) => ({
                ...g,
                baslik: null,
                url: null,
                konu: null,
                son_basvuru: null,
                hibe_orani: null,
            }))
        }
        return mockGrants
    }

    const response = await fetch(
        `${API_BASE_URL}/match-score?sorgu=${encodeURIComponent(query)}`,
    );
    if (!response.ok) {
        throw new Error(`Sunucu hatası: ${response.status}`);
    }
    const data: MatchScoreResponse = await response.json();
    return data.sonuclar;
}

export async function fetchAllGrant(): Promise<rawGrant[]> {
    if (USE_MOCK) {
        await delay(500);
        return mockRawGrants;
    }

    const response = await fetch(`${API_BASE_URL}/fetch-grants`);
    if (!response.ok) {
        throw new Error(`Sunucu hatası: ${response.status}`);
    }
    const data: FetchedGrantsResponse = await response.json();
    return data.fonlar;
}
