import { catchError } from "../common"
import spotify from "./spotifyConfig";

const track = {
    getTrack: async (id: string) => {
        try {
            const url = `${spotify.base_url}/tracks/${id}`;
            const res = await fetch(url, {
                method: 'get',
                headers: spotify.headers,
            })
            const data = await res.json() as SpotifyTrackProps;
            if (!res.ok) throw new Error(res.status + res.statusText);
            return data;
        } catch (err) {
            throw catchError(err);
        }
    },
    
}

export default track