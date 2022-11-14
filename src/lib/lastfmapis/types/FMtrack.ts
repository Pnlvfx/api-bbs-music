export interface FMtrackProps {
    results: {
        trackmatches: {
            track: FmTrack[]
        }
    }
}

export interface FmTrack {
    name: string
    artist: string
    url: string
    streamable: string
    image: FMimage[]
}

export type FMimage = {
    '#text': string
    size: string
}