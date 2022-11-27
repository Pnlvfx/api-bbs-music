import { IUser } from "../../models/types/user";
import { catchError } from "../common";
import lastfmapis from "../lastfmapis/lastfmapis";
import { FMSimilar } from "../lastfmapis/types/FMsimilartrack";
import youtubeapis from "../youtubeapis/youtubeapis";

const playerapis = {
  create_queue: async (user: IUser) => {
    try {
      let tracks: FMSimilar[] = [];
      await Promise.all(
        user.liked_artists.map(async (liked_artist) => {
          const artist_tracks = await lastfmapis.artist.getTopTracks(
            liked_artist
          );
          artist_tracks.length = 10;
          const arr = tracks.concat(artist_tracks);
          tracks = arr;
        })
      );
      let index = 0;

      const timer = setInterval(async () => {
        if (index === tracks.length - 1) {
            console.log('cleared');
          clearInterval(timer);
          return 'done';
        }
        const track = tracks[index];
        index += 1;
        const savedTrack = await youtubeapis.downloadTrack(
          track.artist.name,
          track.name
        );
        if (user.player.next.find((next) => next === savedTrack._id)) return;
        console.log(savedTrack.title, 'added to DB');
        user.player.next.push(savedTrack._id);
        await user.save();
      }, 25000);
    } catch (err) {
      throw catchError(err);
    }
  },
};

export default playerapis;
