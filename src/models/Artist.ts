import {Schema, model} from "mongoose"; 
import { ArtistProps } from "./types/artist";

const ArtistSchema = new Schema<ArtistProps>({
    followers: {
        total: Number
    },
    genres: [String],
    spID: {
        type: String,
        unique: true
    },
    images: [],
    name: String,
    popularity: Number,
    type: String
});
const Artist = model('Artist', ArtistSchema);

export default Artist;