import { catchError } from "../../../lib/common";
import lastfmapis from "../lastfmapis";
import config from '../../../config/config';
import { FmTrack } from "../types/FMtrack";
import { FMartistSearch } from "../types/FMartist";

const artist = {
    getInfo: async () => {
        try {
           const url = `${lastfmapis.base_url}?method=artist.getinfo&artist=Cher&api_key=${config.LASTFM_API_KEY}&format=json`;
           const res = await fetch(url, {
            method: 'GET',
           });
           const data = await res.json();
           console.log(data);
        } catch (err) {
            catchError(err);
        }
    },
    search: async (text: string) => {
        try {
            const url = `${lastfmapis.base_url}?method=artist.search&artist=${text}&api_key=${config.LASTFM_API_KEY}&format=json`;
            const res = await fetch(url, {
                method: 'GET'
            });
            const data = await res.json();
            if (!res.ok) throw new Error('Something went wrong, please try again!')
            return data.results.artistmatches.artist as FMartistSearch[];
        } catch (err) {
            throw catchError(err);
        }
    }
}

export default artist;
