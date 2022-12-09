import Player from "../../models/Player";
import { IUser } from "../../models/types/user";
import telegramapis from "../telegramapis/telegramapis";
import youtubeapis from "../youtubeapis/youtubeapis";
import initialQueue from "./initialQueue/initialQueue";

const playerapis = {
  create_queue: async (user: IUser) => {
    try {
      const player = await Player.findById(user.player);
      if (!player) throw new Error('Something went wrong! Please contact support!');
      const tenArtists = await initialQueue.getTenArtists(user);
      const tracks = await initialQueue.getHundredTracks(tenArtists, user);
      console.log({artists: tenArtists.length, track: tracks.length}, 'started');
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
            track.id,
          );
          if (player.next.find((next) => next === savedTrack._id)) return;
          player.next.push(savedTrack._id);
          playerapis.shuffleArray(player.next);
          await player.save();
          telegramapis.sendLog(`${savedTrack.title}, saved added to initialQueue`)
        } catch (err) {
          telegramapis.sendLog(`error inside interval`)
          console.log(err);
        }
      }, 60000);
    } catch (err) {
      telegramapis.sendLog(JSON.stringify(err));
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
