import { FMimage } from "./FMtrack"

export interface FMSimilar {
    name: string
    playcount: number
    match: number
    url: string
    streamable: {

    }
    artist: {
        name: string
        mbid?: string
        url: string
    }
    image: FMimage[]
}