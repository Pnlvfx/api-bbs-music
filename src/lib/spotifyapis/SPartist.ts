import { catchError } from "../common";
import spotify from "./spotifyConfig";

const artist = {
    getArtist: async (id: string) => {
        try {
            const url = `${spotify.base_url}/artists/${id}`;
            const res = await fetch(url, {
                method: 'get',
                headers: spotify.headers,
            });
            const data = await res.json() as SpotifyArtistProps
            if (!res.ok) throw new Error(res.status + ' ' + res.statusText)
            return data;
        } catch (err) {
            throw catchError(err);
        }
    },
    getRelatedArtist: async (id: string) => {
        try {
            const url = `${spotify.base_url}/artists/${id}/related-artists`;
            const res = await fetch(url, {
                method: 'get',
                headers: spotify.headers,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(res.status + ' ' + res.statusText)
            return data.artists as SpotifyArtistProps[];
        } catch (err) {
            throw catchError(err);
        }
    },
    getTopTrack: async (id: string, market: string) => {
        try {
            const url = `${spotify.base_url}/artists/${id}/top-tracks?market=${market}`;
            const res = await fetch(url, {
                method: 'get',
                headers: spotify.headers,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(res.status + ' ' + res.statusText)
            return data.tracks as SpotifyTrackProps[];
        } catch (err) {
            throw catchError(err);
        }
    }
}

export default artist;
