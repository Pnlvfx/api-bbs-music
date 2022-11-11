import { catchError } from "../../../lib/common";
import lastfmapis from "../lastfmapis";
import config from '../../../config/config';
import { TrackSearch } from "../../../types/track";
import Song from "../../../models/Song";

const track = {
    search: async (text: string) => {
        try {
            const url = `${lastfmapis.base_url}?method=track.search&track=${text}&api_key=${config.LASTFM_API_KEY}&format=json`;
            const res = await fetch(url, {
                method: 'GET'
            });
            const data = await res.json();
            if (!res.ok) throw new Error(`Server error: Please don't panic we will fix it as soon as possible!`);
            const songs = data.results.trackmatches.track;
            // await Promise.all(
            //     songs.map(async (song: any) => {
            //         const dataSong = await Song.findOne({title: song.name});
            //         if (dataSong) {
            //             song = dataSong
            //         }
            //     })
            // )
            return songs;
        } catch (err) {
            throw catchError(err);
        }
    }
}

export default track;