export interface TrackSearch {
    name: string
    artist: string
    url: string
    image: imageProps[]
}

type imageProps = {
    '#text': string
    size: string
}