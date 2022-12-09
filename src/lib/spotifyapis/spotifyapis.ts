import { catchError } from "../common";
import spotify, { access_token_path } from "./spotifyConfig";
import config from '../../config/config';
import coraline from "../../coraline/coraline";
import artist from "./SPartist";
import { SpotifySearchProps } from "./types/search";
import track from "./SPtrack";
import spotifyError from "./spotifyError";

//const expiryTime = new Date().getTime() + access_token.expires_in * 1000;

const spotifyapis = {
    getAccessToken: async () => {
        try {
            const url = `${spotify.auth_url}/api/token?grant_type=client_credentials`;
            const encondedHeader = Buffer.from(`${config.SPOTIFY_CLIENT_ID}:${config.SPOTIFY_CLIENT_SECRET}`).toString("base64");
            const headers = {
                Authorization: `Basic ${encondedHeader}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            const res = await fetch(url, {
                method: 'POST',
                headers,
            })
            const data = await res.json();
            if (!res.ok) throw new Error(res.status + res.statusText);
            await coraline.saveJSON(access_token_path, data);
            return data as AccessTokenProps;
        } catch (err) {
            throw catchError(err);
        }
    },
    search: async (query: string, type: string, market: string) => {
        try {
            const url = `${spotify.base_url}/search?q=${query}&type=${type}&market=${market}`;
            const res = await fetch(url, {
                method: 'get',
                headers: spotify.headers,
            })
            const data = await res.json() as SpotifySearchProps;
            if (!res.ok) await spotifyError(res.status, data);
            return data;
        } catch (err) {
            throw catchError(err);
        }
    },
    artist,
    track,
    getRecommendations: async (seed_artists: string, seed_genres: string, seed_tracks: string, market: string) => {
        try {
            console.log({seed_artists, seed_genres, seed_tracks, market})
            const url = `${spotify.base_url}/recommendations?` + new URLSearchParams({
                seed_artists,
                seed_genres,
                seed_tracks,
                market
            });
            const res = await fetch(url, {
                method: 'get',
                headers: spotify.headers,
            })
            const data = await res.json()
            if (!res.ok) await spotifyError(res.status, data);
            return data.tracks as SpotifyTrackProps[];
        } catch (err) {
            throw catchError(err);
        }
    }
}

export default spotifyapis;
