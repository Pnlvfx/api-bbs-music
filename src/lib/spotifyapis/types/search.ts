import { Types } from "mongoose";
import { TrackProps } from "../../../models/types/track";

export interface SpotifySearchProps {
    artists: {
        items: SpotifyArtistProps[]
    }
    tracks: {
        items: SpotifyTrackProps[] | TrackProps[] & {
            _id: Types.ObjectId
        }
    }
}