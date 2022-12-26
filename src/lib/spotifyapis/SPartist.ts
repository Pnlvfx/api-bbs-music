import { catchError } from "../common";
import spotify from "./spotifyConfig";
import spotifyError from "./spotifyError";

const artist = {
    getArtist: async (id: string) => {
        try {
            const url = `${spotify.base_url}/artists/${id}`;
            const res = await fetch(url, {
                method: 'get',
                headers: spotify.headers,
            });
            const data = await res.json() as SpotifyArtistProps
            if (!res.ok) await spotifyError(res.status, data);
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
            if (!res.ok) await spotifyError(res.status, data);
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
            if (!res.ok) await spotifyError(res.status, data);
            return data.tracks as SpotifyTrackProps[];
        } catch (err) {
            throw catchError(err);
        }
    },
    getArtistAlbums: async (id: string, market: string) => {
        try {
            const url = `${spotify.base_url}/artists/${id}/albums?market=${market}`;
            const res = await fetch(url, {
                method: 'get',
                headers: spotify.headers,
            });
            const data = await res.json();
            if (!res.ok) await spotifyError(res.status, data);
            return data.items as SpotifyAlbumProps[];
        } catch (err) {
            throw catchError(err);
        }
    }
}

export default artist;
