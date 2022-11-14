import { SongProps } from "../models/types/song";

export interface SearchResult extends SongProps {
    isSaved: boolean
}