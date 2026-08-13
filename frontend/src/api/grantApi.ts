import type {grant, MatchScoreResponse} from "../types/grant.ts";
import type {rawGrant, FetchedGrantsResponse} from "../types/rawGrant.ts";

const API_BASE_URL = 'http://127.0.0.1:8000'

export async function fetchMatchedGrants(query: string): Promise<grant[]> {
    const response = await fetch(
        `${API_BASE_URL}/match-score?sorgu=${encodeURIComponent(query)}`
    )
    if (!response.ok) {
        throw new Error(`Sunucu hatası: ${response.status}`)
    }
    const data: MatchScoreResponse = await response.json()
    return data.sonuclar
}

export async function fetchAllGrant(): Promise<rawGrant[]> {
    const response = await fetch(
        `${API_BASE_URL}/fetch-grants`
    )
    if (!response.ok) {
        throw new Error(`Sunucu hatası: ${response.status}`)
    }
    const data: FetchedGrantsResponse = await response.json()
    return data.fonlar
}