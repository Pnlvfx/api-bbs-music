import getAudioDurationInSeconds from "get-audio-duration";
import { catchError } from "../../../lib/common";
import config from '../../../config/config';
import { SongProps, YDdownload } from "../../../models/types/song";
import Song from "../../../models/Song";
import { Types } from "mongoose";
import Artist from "../../../models/Artist";
import artist from "../artist-hooks/artist";

export const createTrack = async (song: YDdownload) => {
    const url = `${config.SERVER_URL}/music/${song.videoId}.mp3`;
    const duration = await getAudioDurationInSeconds(song.file);
    const exists = await Artist.exists({name: song.artist});
    if (!exists) {
        const newArtist = await artist.new(song.artist);
    }
    const track = new Song({
        id: song.videoId,
        url,
        type: 'default',
        content_type: 'audio/mp3',
        duration,
        title: song.title,
        artist: song.artist,
        album: '',
        description: '',
        genre: '',
        date: '',
        artwork: song.thumbnail,
        file: song.file
    });
    await track.save();
    return track as SongProps & {
        _id: Types.ObjectId
    };

}

const music = {
    saveMusic: async (song: YDdownload) => {
        try {
            const track = await createTrack(song);
            return track as SongProps & {
                _id: Types.ObjectId
            };
        } catch (err) {
            catchError(err);
        }
    }
}

export default music;
