import { catchError } from "../common";
import spotify from "./spotifyConfig";

const artist = {
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
    }
}

export default artist;
