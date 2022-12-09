import { catchError } from "../common"
import spotify from "./spotifyConfig";
import spotifyError from "./spotifyError";

const track = {
    getTrack: async (id: string) => {
        try {
            const url = `${spotify.base_url}/tracks/${id}`;
            const res = await fetch(url, {
                method: 'get',
                headers: spotify.headers,
            })
            const data = await res.json() as SpotifyTrackProps;
            if (!res.ok) await spotifyError(res.status, data);
            return data;
        } catch (err) {
            throw catchError(`${err}, spotify.artists.getTrack`);
        }
    },
    
}

export default track