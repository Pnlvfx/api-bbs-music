import { IUser } from "../../models/types/user";
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
        try {
          if (index === tracks.length - 1) {
            console.log("cleared");
            playerapis.shuffleArray(user.player.next);
            clearInterval(timer);
            return "done";
          }
          const track = tracks[index];
          index += 1;
          const savedTrack = await youtubeapis.downloadTrack(
            track.artist.name,
            track.name
          );
          if (user.player.next.find((next) => next === savedTrack._id)) return;
          console.log(savedTrack.title, "added to DB");
          user.player.next.push(savedTrack._id);
          await user.save();
        } catch (err) {
          console.log(err);
        }
      }, 25000);
    } catch (err) {
      console.log(err, "playerapis");
    }
  },
  shuffleArray: (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  },
};

export default playerapis;
