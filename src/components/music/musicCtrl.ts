import { Request, Response } from "express";
import { catchErrorCtrl, performanceEnd } from "../../lib/common";
import Track from "../../models/Track";
import youtubeapis from "../../lib/youtubeapis/youtubeapis";
import { UserRequest } from "../../@types/express";
import trackapis from "../../lib/trackapis/trackapis";
import { usePlayer } from "../../lib/playerapis/hooks/playerHooks";

const musicCtrl = {
  getNextTrack: async (userRequest: Request, res: Response) => {
    try {
      const start = performance.now();
      const req = userRequest as UserRequest;
      const { user } = req;
      const player = await usePlayer(user.player);
      const prevIndex =
        player.current.from.split(",")[0] === "library"
          ? user.liked_tracks.findIndex((_) => _.equals(player.current.track))
          : 0;
      const nextTrackID =
        player.queue.length > 0
          ? player.queue[0]
          : player.current.from.split(",")[0] === "library"
          ? user.liked_tracks[prevIndex + 1]
          : player.next[0];
      const nextTrack = await Track.findById(nextTrackID);
      if (!nextTrack) {
        res.status(400).json({ msg: "User queue is empty" });
      } else {
        res.status(200).json(nextTrack);
        performanceEnd(start)
        player.queue.length > 0 ? player.queue.shift() : player.next.shift();
        await player.save();
      }
      if (player.next.length >= 100) return;
      const newTrack = await trackapis.addNext(user, player);
      console.log("New Track added", newTrack.title);
      player.next.splice(0, 0, newTrack._id);
      await player.save();
    } catch (err) {
      console.log(err, "addNextSong");
    }
  },
  downloadMusic: async (userRequest: Request, res: Response) => {
    try {
      const req = userRequest as UserRequest;
      const { artist, track, spID } = req.body;
      if (!artist || !track || !spID)
        return res.status(400).json({ msg: "Missing required body params!" });
      const savedTrack = await youtubeapis.downloadTrack(
        artist,
        track.toString(),
        spID
      );
      res.status(201).json(savedTrack);
    } catch (err) {
      console.log(err, "downloadMusic catch");
      catchErrorCtrl(err, res);
    }
  },
  like: async (userRequest: Request, res: Response) => {
    try {
      const req = userRequest as UserRequest;
      const { ids } = req.body;
      if (!ids)
        return res.status(400).json({ msg: "Missing required params: ids" });
      const { user } = req;
      user.liked_tracks = ids;
      user.save();
      res.status(200).json(true);
    } catch (err) {
      catchErrorCtrl(err, res);
    }
  },
};

export default musicCtrl;
