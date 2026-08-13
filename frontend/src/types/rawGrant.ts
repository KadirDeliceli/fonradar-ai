export type rawGrant = {
    url: string | null;
    baslik: string | null;
}

export type FetchedGrantsResponse = {
    adet: number
    fonlar: rawGrant[]
}



