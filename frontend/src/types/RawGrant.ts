export type RawGrant = {
    url: string | null;
    baslik: string | null;
};

export type FetchedGrantsResponse = {
    adet: number;
    fonlar: RawGrant[];
};
