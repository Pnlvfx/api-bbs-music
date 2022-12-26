interface SpotifyAlbumProps {
    album_group: string
    album_type: string
    artists: SpArtistProps[]
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