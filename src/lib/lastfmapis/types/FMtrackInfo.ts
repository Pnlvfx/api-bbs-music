import { FMimage } from "./FMtrack"

export interface FMTrackInfo {
    name: string
    url: string
    duration: string
    playcount: string
    artist: {
        name: string
        url: string
    }
    album: {
        artist: string
        title: string
        url: string
        image: FMimage[]
    }
}