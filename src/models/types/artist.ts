import { Document } from "mongoose";
import { TrackProps } from "./track";

export interface ArtistProps extends Document {
    name: string
    albums: []
    tracks: TrackProps[]
    thumbnail: string
}