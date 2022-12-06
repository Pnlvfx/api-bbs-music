import { TrackProps } from "../../models/types/track";
import coraline from "../../coraline/coraline";
import Track from "../../models/Track";
import { catchError } from "../common";
import youtubeapis from "../youtubeapis/youtubeapis";
import spotifyapis from "../spotifyapis/spotifyapis";
import { IUser } from "../../models/types/user";
import Player from "../../models/Player";

const trackapis = {
  addNext: async (user: IUser) => {
    try {
      const player = await Player.findById(user.player);
      if (!player) throw new Error('Something went wrong! Please contact support!');
      const currentTrack = await Track.findById(player.current.track);
      if (!currentTrack) throw new Error('Missing current track');
      const similar = await spotifyapis.getRecommendations(currentTrack.artistSpId, currentTrack.genre.toString(), currentTrack.spID, user.countryCode);
      let savedTrack: TrackProps | null = null;
      if (similar.length === 0) throw new Error("FM API does not find similar song!");
      const index = coraline.getRandomInt(similar.length);
      const song = similar[index];
      const dbTrack = await Track.findOne({ title: song.name });
      savedTrack = dbTrack ? dbTrack : await youtubeapis.downloadTrack(song.artists[0].name, song.name, song.id);
      return savedTrack;
    } catch (err) {
      throw catchError(err);
    }
  },
};

export default trackapis;
