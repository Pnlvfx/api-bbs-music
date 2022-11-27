import { Request, Response } from "express";
import Track from "../../models/Track";
import { catchErrorCtrl } from "../../lib/common";
import { getUserFromToken } from "./user-hooks";
import { TrackProps } from "../../models/types/track";
import { UserRequest } from "../../@types/express";
import coraline from "../../coraline/coraline";
import playerapis from "../../lib/playerapis/playerapis";

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
        let last_played: TrackProps[] = [];
        // if (user.last_played.length >= 1) {
        //   await Promise.all(
        //     user.last_played.map(async (latestId) => {
        //       const latest = await Track.findOne({ _id: latestId });
        //       if (!latest) return;
        //       last_played.push(latest);
        //     })
        //   );
        //   last_played.reverse();
        // }
        // if (user.last_played.length >= 1) { // test
        //   await Promise.all(
        //     last_played.map((last) => {
        //       console.log(last);
        //     })
        //   )
        // }
        res.status(200).json({
          username: user.username,
          avatar: user.avatar,
          role: user.role,
          liked_tracks: user.liked_tracks,
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
      const tracks = await Promise.all(
        user.last_search.map(async (last_s) => {
          const track = await Track.findById(last_s);
          return track;
        })
      );
      tracks.reverse();
      res.status(200).json({ tracks });
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
      if (user.last_search.length < 1) {
        user.last_search.push(track._id);
      } else if (user.last_search.length === 1) {
        if (track._id === user.last_search[0]._id) return;
        user.last_search.push(track._id);
      } else {
        const exist = user.last_search.find(
          (last_s) => last_s.toString() === track._id.toString()
        );
        if (exist) {
          /// this function sometimes crash;
          const index = user.last_search.findIndex(
            (last_s) => last_s.toString() === track._id.toString()
          );
          console.log("saveLastSearch index is", index);
          coraline.arrayMove(user.last_search, index, user.last_search.length);
        } else {
          if (user.last_search.length >= 50) {
            // delete older and add new (limit 50);
            user.last_search.shift();
          }
          user.last_search.push(track._id);
        }
      }
      await user.save();
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
