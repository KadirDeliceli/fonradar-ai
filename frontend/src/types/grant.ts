export type grant = {
    skor: number
    aciklama: string | null
    sehir_durumu: string | null
    konu: string | null
    son_basvuru: string | null
    hibe_orani: string | null
    baslik: string | null
    url: string | null
}

export type MatchScoreResponse = {
    durum: string
    guncelleniyor: boolean
    mesaj: string
    sonuclar: grant[]
}
