import { Types } from "mongoose";
import { TrackProps } from "../../../models/types/track";

export interface SpotifySearchProps {
    artists: SearchResponse<SpotifyArtistProps[]>
    tracks: SearchResponse<SpotifyTrackProps[] | TrackProps[] & {
        _id: Types.ObjectId
    }>
}

type SearchResponse<Items> = {
    href: string
    items: Items
    limit: number
    offset: number
    previous: null
    total: number
}