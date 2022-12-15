import { TrackProps } from "../../models/types/track";
import Track from "../../models/Track";
import { catchError } from "../common";
import youtubeapis from "../youtubeapis/youtubeapis";
import spotifyapis from "../spotifyapis/spotifyapis";
import { IUser } from "../../models/types/user";
import { PlayerProps } from "../../models/types/player";
import telegramapis from "../telegramapis/telegramapis";

const trackapis = {
  addNext: async (user: IUser, player: PlayerProps) => {
    try {
      const currentTrack = await Track.findById(player.current.track);
      if (!currentTrack) throw new Error('Missing current track');
      if (currentTrack.genre.length = 0) {
        await telegramapis.sendLog('Missing genres for this track!')
        throw new Error('Missing genre for this track!');
      }
      const similar = await spotifyapis.getRecommendations(currentTrack.artistSpID, currentTrack.genre.toString(), currentTrack.spID, user.countryCode);
      let savedTrack: TrackProps | null = null;
      if (similar.length === 0) throw new Error("Spotify API does not find similar song!");
      similar.sort((a, b) => {
        return b.popularity - a.popularity
      })
      const song = similar[0];
      const dbTrack = await Track.findOne({ title: song.name });
      savedTrack = dbTrack ? dbTrack : await youtubeapis.downloadTrack(song.id);
      return savedTrack;
    } catch (err) {
      throw catchError(err);
    }
  },
};

export default trackapis;
