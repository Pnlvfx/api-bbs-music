import { Request, Response } from "express";
import Track from "../../models/Track";
import { catchErrorCtrl } from "../../lib/common";
import { getUserFromToken } from "./user-hooks";
import { UserRequest } from "../../@types/express";
import playerapis from "../../lib/playerapis/playerapis";
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
        // if (player.next.length <= 50) {
        //   initialQueue.
        // }
        const last_played = await Track.findById(player.current.track);
        const liked_tracks = await Track.find({_id: user.liked_tracks});
        liked_tracks.sort((a, b) => {
          return user.liked_tracks.indexOf(a._id) - user.liked_tracks.indexOf(b._id)
        })
        res.status(200).json({
          username: user.username,
          avatar: user.avatar,
          role: user.role,
          liked_tracks,
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
      const tracks = await Track.find({_id: user.last_search});
      tracks.sort((a, b) => {
        return user.last_search.indexOf(a._id) - user.last_search.indexOf(b._id)
      })
      res.status(200).json({tracks: {items: tracks}});
    } catch (err) {
      catchErrorCtrl(err, res);
    }
  },
  saveLastSearch: async (userRequest: Request, res: Response) => {
    try {
      const req = userRequest as UserRequest;
      const { ids } = req.body;
      if (!ids) return res.status(400).json({ msg: "Missing ids body params!" });
      const { user } = req;
      user.last_search = ids;
      await user.save();
      res.status(200).json(true);
    } catch (err) {
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
