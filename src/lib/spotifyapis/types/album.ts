interface SpotifyAlbumProps {
    album_type: string
    artists: SpArtistProps[]
    available_markets: [string]
    external_urls: {
        spotify: string
    }
    href: string
    id: string
    images: SpotifyImageProps[]
    name: string
    release_date: string
    release_date_precision: string
    total_tracks: number
    type: string
    uri: string
}