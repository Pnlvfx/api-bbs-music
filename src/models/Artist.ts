import {Schema, model} from "mongoose";
import { ArtistProps } from "./types/artist";

const ArtistSchema = new Schema<ArtistProps>({
    name: {
        type: String,
        required: true
    },
    albums: {

    },
    tracks: {
        
    },
    thumbnail: {
        type: String
    }
}, {
    timestamps: true
});
const Artist = model('Artist', ArtistSchema);

export default Artist;