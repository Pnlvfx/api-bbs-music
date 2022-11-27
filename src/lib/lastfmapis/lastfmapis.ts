import artist from "./route/FMartist";
import track from './route/FMtrack';

const base_url = 'http://ws.audioscrobbler.com/2.0/';

const lastfmapis = {
    base_url,
    artist,
    track
}

export default lastfmapis;