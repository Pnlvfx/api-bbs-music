import { Request, Response } from "express";
import Track from "../../models/Track";
import { catchErrorCtrl } from "../../lib/common";
import { getUserFromToken } from "./user-hooks";
import { UserRequest } from "../../@types/express";
import coraline from "../../coraline/coraline";
import playerapis from "../../lib/playerapis/playerapis";
import User from "../../models/User";
import Player from "../../models/Player";

const userCtrl = {
  user: async (req: Request, res: Response) => {
    try {
      const { token } = req.cookies;
      if (!token) return res.status(200).json(undefined);
      const user = await getUserFromToken(token);
      if (!user) {
        res
          .status(601)
          .clearCookie("token", {
            httpOnly: true,
          })
          .json(undefined);
      } else {
        const player = await Player.findById(user.player);
        if (!player) return res.status(500).json({msg: 'Something went wrong! Please contact support!'});
        const last_played = await Track.findById(player.current.track);
        const liked_tracks = await Track.find({_id: user.liked_tracks});
        res.status(200).json({
          username: user.username,
          avatar: user.avatar,
          role: user.role,
          liked_tracks: liked_tracks.reverse(),
          last_played,
          liked_artists: user.liked_artists,
        });
      }
    } catch (err) {
      catchErrorCtrl(err, res);
    }
  },
  getLastSearch: async (userRequest: Request, res: Response) => {
    try {
      const req = userRequest as UserRequest;
      const { user } = req;
      if (user.last_search.length <= 0) return res.status(200).json([]);
      const tracks = await Track.find({_id:  user.last_search});
      res.status(200).json({tracks: {items: tracks.reverse()}});
    } catch (err) {
      catchErrorCtrl(err, res);
    }
  },
  saveLastSearch: async (userRequest: Request, res: Response) => {
    try {
      const req = userRequest as UserRequest;
      const { id } = req.body;
      if (!id) return res.status(400).json({ msg: "Missing id body params!" });
      const { user } = req;
      const track = await Track.findById(id);
      if (!track) return res.status(400).json({ msg: "Invalid track!" });
      console.log(track.title, 'added to last searched');
      const exists = await User.exists({last_search: id, _id: user._id});
      if (exists) {
        const index = user.last_search.findIndex(
          (last_s) => last_s.toString() === track._id.toString()
        );
        coraline.arrayMove(user.last_search, index, user.last_search.length - 1);
      } else {
        if (user.last_search.length >= 50) {
          user.last_search.shift();
        }
        user.last_search.push(track._id);
      }
      await user.save();
      const test = await Track.find({_id: user.last_search});
      console.log(test)
      res.status(200).json(true);
    } catch (err) {
      console.log(err, "last search catch");
      throw catchErrorCtrl(err, res);
    }
  },
  createQueue: async (userRequest: Request, res: Response) => {
    try {
      const req = userRequest as UserRequest;
      const { user } = req;
      const queue = playerapis.create_queue(user);
      res.status(200).json("Started");
    } catch (err) {
      catchErrorCtrl(err, res);
    }
  },
};

export default userCtrl;
