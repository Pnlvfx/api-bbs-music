import { TrackProps } from "../../models/types/track";
import coraline from "../../coraline/coraline";
import Track from "../../models/Track";
import { catchError } from "../common";
import lastfmapis from "../lastfmapis/lastfmapis";
import youtubeapis from "../youtubeapis/youtubeapis";

const trackapis = {
  addNext: async (artist: string, title: string) => {
    try {
      const similar = await lastfmapis.track.getSimilar(artist, title);
      let savedTrack: TrackProps | null = null;
      if (similar.length === 0) throw new Error("FM API does not find similar song!");
      const index = coraline.getRandomInt(similar.length);
      const song = similar[index];
      const dbTrack = await Track.findOne({ title: song.name });
      savedTrack = dbTrack ? dbTrack : await youtubeapis.downloadTrack(song.artist.name, song.name);
      return savedTrack;
    } catch (err) {
      throw catchError(err);
    }
  },
};

export default trackapis;
