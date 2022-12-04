import { Request, Response } from "express";
import { catchErrorCtrl } from "../../lib/common";
import Track from "../../models/Track";
import youtubeapis from "../../lib/youtubeapis/youtubeapis";
import { UserRequest } from "../../@types/express";
import trackapis from "../../lib/trackapis/trackapis";

const musicCtrl = {
  addNextTrack: async (userRequest: Request, res: Response) => {
    try {
      const req = userRequest as UserRequest;
      const {user} = req;
      const nextTrackID = user.player.next[0];
      const nextTrack = await Track.findById(nextTrackID);
      if (!nextTrack) return res.status(400).json({msg: 'User queue is empty'});
      res.status(200).json(nextTrack);
      const deleteFromQueue = user.player.next.filter(item => item._id.toString() !== nextTrackID.toString());
      user.player.next = deleteFromQueue;
      if (user.player.next.length >= 100) return
      const newTrack = await trackapis.addNext(nextTrack?.artist, nextTrack?.title);
      console.log('New Track added', newTrack.title)
      user.player.next.splice(0, 0, newTrack._id);
      await user.save();
    } catch (err) {
      console.log(err, 'addNextSong');
    }
  },
  downloadMusic: async (userRequest: Request, res: Response) => {
    try {
      const req = userRequest as UserRequest;
      const { artist, track } = req.body;
      if (!artist || !track) return res.status(400).json({ msg: "Missing required body params!" });
      const savedTrack = await youtubeapis.downloadTrack(
        artist,
        track.toString()
      );
      res.status(201).json(savedTrack);
    } catch (err) {
      console.log(err, 'downloadMusic catch');
      catchErrorCtrl(err, res);
    }
  },
  like: async (userRequest: Request, res: Response) => {
    try {
      const req = userRequest as UserRequest;
      const { _id } = req.body;
      if (!_id) return res.status(400).json({ msg: "Missing required params: _id" });
      const { user } = req;
      const exists = user.liked_tracks.find(
        (liked) => liked.toString() === _id
      );
      if (exists) {
        const filter = user.liked_tracks.filter((liked) => liked !== exists);
        user.liked_tracks = filter;
      } else {
        user.liked_tracks.push(_id);
      }
      await user.save();
      res.status(200).json(exists ? false : true);
    } catch (err) {
      catchErrorCtrl(err, res);
    }
  },
};

export default musicCtrl;
