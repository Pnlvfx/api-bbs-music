import Player from "../../models/Player";
import { IUser } from "../../models/types/user";
import spotifyapis from "../spotifyapis/spotifyapis";
import youtubeapis from "../youtubeapis/youtubeapis";

const playerapis = {
  create_queue: async (user: IUser) => {
    try {
      const player = await Player.findById(user.player);
      if (!player) throw new Error('Something went wrong! Please contact support!');
      let tracks: SpotifyTrackProps[] = [];
      await Promise.all(
        user.liked_artists.map(async (liked_artist) => {
          const artist_tracks = await spotifyapis.artist.getTopTrack(
            liked_artist.spID,
            user.countryCode
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
            playerapis.shuffleArray(player.next);
            clearInterval(timer);
            return "done";
          }
          const track = tracks[index];
          index += 1;
          const savedTrack = await youtubeapis.downloadTrack(
            track.artists[0].name,
            track.name,
            track.id
          );
          if (player.next.find((next) => next === savedTrack._id)) return;
          console.log(savedTrack.title, "added to DB");
          player.next.push(savedTrack._id);
          await player.save();
        } catch (err) {
          console.log(err);
        }
      }, 40000);
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
