import {Schema, model} from "mongoose";
import { TrackProps } from "./types/track";

const TrackSchema = new Schema<TrackProps>({
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
    artistSpID: {
        type: String,
    },
    album: {
        type: String,
    },
    description: {
        type: String,
    },
    genre: {
        type: [String],
    },
    popularity: {
        type: Number,
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
    is_saved: {
        type: Boolean,
        default: true
    },
    spID: {
        type: String,
    }
}, {
    timestamps: true
});

const Track = model('Track', TrackSchema);

export default Track;