import coraline from "../../coraline/coraline";
import fs from 'fs';

const AUTH_URL = "https://accounts.spotify.com";
const BASE_URL = "https://api.spotify.com/v1";

const path = coraline.use("spotify");
export const access_token_path = `${path}/access_token.json`;

const token = coraline.readJSONSync(access_token_path) as AccessTokenProps;

const headers = {
    Authorization: `Bearer ${token.access_token}`,
    'Content-Type': 'application/json'
}

const refreshHeaders = (access_token: string) => {
    spotify.headers.Authorization = `Bearer ${access_token}`
}

const spotify = {
    auth_url: AUTH_URL,
    base_url: BASE_URL,
    headers,
    refreshHeaders,
}

export default spotify;
