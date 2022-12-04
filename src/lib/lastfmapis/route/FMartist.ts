import { catchError } from "../../common";
import lastfmapis from "../lastfmapis";
import config from "../../../config/config";
import { FMartistSearch } from "../types/FMartist";
import { FMSimilar } from "../types/FMsimilartrack";

const artist = {
  getInfo: async () => {
    try {
      const url = `${lastfmapis.base_url}?method=artist.getinfo&artist=Cher&api_key=${config.LASTFM_API_KEY}&format=json`;
      const res = await fetch(url, {
        method: "GET",
      });
      const data = await res.json();
    } catch (err) {
      catchError(err);
    }
  },
  search: async (text: string) => {
    try {
      const url = `${lastfmapis.base_url}?method=artist.search&artist=${text}&api_key=${config.LASTFM_API_KEY}&format=json`;
      const res = await fetch(url, {
        method: "GET",
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Something went wrong, please try again!");
      //let response: FMartistSearch[] = [];
      //   await Promise.all(
      //     data.results.artistmatches.artist.map((artist) => {
      //       if (!music.isValidArtist(artist.name)) return;
      //       response.push(artist);
      //     })
      //   );
      return data.results.artistmatches.artist as FMartistSearch[];
    } catch (err) {
      throw catchError(err);
    }
  },
  getTopGeoArtist: async (country: string) => {
    try {
      const url = `${lastfmapis.base_url}?method=geo.gettopartists&country=${country}&api_key=${config.LASTFM_API_KEY}&format=json`;
      const res = await fetch(url, {
        method: "GET",
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Something went wrong, please try again!");
      return data.topartists.artist as FMartistSearch[];
    } catch (err) {
      throw catchError(err);
    }
  },
  getSimilar: async (artist: string) => {
    try {
      const url = `${lastfmapis.base_url}?method=artist.getsimilar&artist=${artist}&api_key=${config.LASTFM_API_KEY}&format=json`;
      const res = await fetch(url, {
        method: "GET",
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Something went wrong, please try again!");
      return data.similarartists.artist;
    } catch (err) {
      throw catchError(err);
    }
  },
  getTopTracks: async (artist: string) => {
    try {
      const url = `${lastfmapis.base_url}?method=artist.gettoptracks&artist=${artist}&api_key=${config.LASTFM_API_KEY}&format=json`;
      const res = await fetch(url, {
        method: "GET",
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Something went wrong, please try again!");
      return data.toptracks.track as FMSimilar[];
    } catch (err) {
      throw catchError(err);
    }
  },
};

export default artist;
