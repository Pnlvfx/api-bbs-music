import Artist from "../../models/Artist";
import { PlayerProps } from "../../models/types/player";
import { IUser } from "../../models/types/user";
import telegramapis from "../telegramapis/telegramapis";
import youtubeapis from "../youtubeapis/youtubeapis";
import { usePlayer } from "./hooks/playerHooks";
import initialQueue from "./initialQueue/initialQueue";

const playerapis = {
  create_queue: async (user: IUser) => {
    try {
      const player = await usePlayer(user.player);
      const likedArtists = await Artist.find({_id: user.liked_artists});
      const tenArtists = await initialQueue.getTenArtists(likedArtists);
      const tracks = await initialQueue.getHundredTracks(tenArtists, user);
      console.log(
        { artists: tenArtists.length, track: tracks.length },
        "started"
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
          const savedTrack = await youtubeapis.downloadTrack(track.id);
          if (player.next.find((next) => next === savedTrack._id)) return;
          player.next.push(savedTrack._id);
          playerapis.shuffleArray(player.next);
          await player.save();
          telegramapis.sendLog(
            `${savedTrack.title}, saved added to initialQueue`
          );
        } catch (err) {
          telegramapis.sendLog(`error inside interval`);
          console.log(err);
          clearInterval(timer);
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
  saveToRecentlyPlayed: (player: PlayerProps) => {
    const exist = player.recently_played.length > 0 ? player.recently_played.find((item) =>
      item.equals(player.current.track)
    ) : false;
    if (exist) {
    } else {
      player.recently_played.push(player.current.track);
    }
  },
};

export default playerapis;
