import { catchError } from "../../common";
import lastfmapis from "../lastfmapis";
import config from '../../../config/config';
import { FMtrackProps } from "../types/FMtrack";
import { FMSimilar } from "../types/FMsimilartrack";
import { FMTrackInfo } from "../types/FMtrackInfo";

const track = {
    search: async (text: string, limit: number) => {
        try {
            text = encodeURIComponent(text);
            const url = `${lastfmapis.base_url}?method=track.search&track=${text}&limit=${limit}&api_key=${config.LASTFM_API_KEY}&format=json`;
            const res = await fetch(url, {
                method: 'GET'
            });
            const data = await res.json() as FMtrackProps;
            if (!res.ok) throw new Error(`Server error: Please don't panic we will fix it as soon as possible!`);
            const tracks = data.results.trackmatches.track;
            return tracks;
        } catch (err) {
            throw catchError(err);
        }
    },
    getSimilar: async (artist: string, track: string) => {
        try {
            artist = encodeURIComponent(artist);
            track = encodeURIComponent(track);
            const url = `${lastfmapis.base_url}?method=track.getsimilar&artist=${artist}&track=${track}&api_key=${config.LASTFM_API_KEY}&format=json`;
            const res = await fetch(url, {
                method: 'GET'
            });
            const data = await res.json();
            if (!res.ok) throw new Error(`Server error: Please don't panic we will fix it as soon as possible!`);
            const similar = data.similartracks.track;
            return similar as FMSimilar[]
        } catch (err) {
            throw catchError(err);
        }
    },
    getInfo: async (artist: string, track: string) => {
        try {
            artist = encodeURIComponent(artist);
            track = encodeURIComponent(track);
            const url = `${lastfmapis.base_url}?method=track.getInfo&artist=${artist}&track=${track}&api_key=${config.LASTFM_API_KEY}&format=json`;
            const res = await fetch(url, {
                method: 'GET'
            });
            const data = await res.json();
            if (!res.ok) throw new Error(`Server error: Please don't panic we will fix it as soon as possible!`);
            return data as FMTrackInfo;
        } catch (err) {
            throw catchError(err);
        }
    }
}

export default track;