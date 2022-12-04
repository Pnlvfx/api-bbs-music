import { catchError } from "../common";
import spotify, { access_token_path } from "./spotifyConfig";
import config from '../../config/config';
import coraline from "../../coraline/coraline";
import artist from "./SPartist";
import { SpotifySearchProps } from "./types/search";

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
    search: async (query: string, type: string) => {
        try {
            const url = `${spotify.base_url}/search?q=${query}&type=${type}`;
            const res = await fetch(url, {
                method: 'get',
                headers: spotify.headers,
            })
            const data = await res.json() as SpotifySearchProps;
            if (!res.ok) throw new Error(res.status + res.statusText);
            return data;
        } catch (err) {
            throw catchError(err);
        }
    },
    artist,
}

export default spotifyapis;
