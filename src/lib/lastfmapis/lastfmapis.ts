import artist from "./route/FMartist";
import track from "./route/FMtrack";

const base_url = "http://ws.audioscrobbler.com/2.0/";

const lastfmapis = {
  base_url,
  artist,
  track,
  isValidArtist: (artist: string) => {
    if (artist.match(" & ")) return false;
    if (artist.match(" e ")) return false;
    if (artist.match(" et ")) return false;
    if (artist.match(" ft. ")) return false;
    if (artist.match(" feat. ")) return false;
    if (artist.includes(", ")) return false;
    const containsSpecialChars = (str: string) => {
      const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
      return specialChars.test(str);
    };
    if (containsSpecialChars(encodeURI(artist).replaceAll("%20", "")))
      return false;
    return true;
  },
};

export default lastfmapis;
