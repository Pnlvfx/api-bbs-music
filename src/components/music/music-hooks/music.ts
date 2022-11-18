import getAudioDurationInSeconds from "get-audio-duration";
import { catchError } from "../../../lib/common";
import config from '../../../config/config';
import { TrackProps, YDdownload } from "../../../models/types/track";
import Track from "../../../models/Track";
import { Types } from "mongoose";

export const createTrack = async (song: YDdownload) => {
    const url = `${config.SERVER_URL}/music/${song.videoId}.mp3`;
    const duration = await getAudioDurationInSeconds(song.file);
    const track = new Track({
        id: song.videoId,
        url,
        type: 'default',
        content_type: 'audio/mp3',
        duration,
        title: song.title,
        artist: song.artist,
        album: song.info?.album,
        description: '',
        genre: '',
        date: '',
        artwork: song.thumbnail,
        file: song.file
    });
    await track.save();
    return track as TrackProps & {
        _id: Types.ObjectId
    };

}

const music = {
    saveMusic: async (song: YDdownload) => {
        try {
            const track = await createTrack(song);
            return track as TrackProps & {
                _id: Types.ObjectId
            };
        } catch (err) {
            throw catchError(err);
        }
    }
}

export default music;
