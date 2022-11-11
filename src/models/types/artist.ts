import { Document } from "mongoose";
import { SongProps } from "./song";

export interface ArtistProps extends Document {
    name: string
    albums: []
    songs: SongProps[]
    thumbnail: string
}