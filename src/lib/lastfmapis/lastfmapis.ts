import artist from "./route/artist";
import track from './route/track';

const base_url = 'http://ws.audioscrobbler.com/2.0/';

const lastfmapis = {
    base_url,
    artist,
    track
}

export default lastfmapis;