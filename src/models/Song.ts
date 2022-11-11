import {Schema, model} from "mongoose";
import { SongProps } from "./types/song";

const SongSchema = new Schema<SongProps>({
    id: {
        type: String,
        required: true,
        unique: true
    },
    url: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    content_type: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    album: {
        type: String,
    },
    description: {
        type: String,
    },
    genre: {
        type: String,
    },
    date: {
        type: String,
    },
    artwork: {
        type: String,
        required: true
    },
    file: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});
const Song = model('Song', SongSchema);

export default Song;