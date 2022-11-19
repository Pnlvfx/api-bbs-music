import { Request, Response } from "express";
import Track from "../../models/Track";
import { catchErrorCtrl } from "../../lib/common";
import { getUserFromToken } from "./user-hooks";
import { TrackProps } from "../../models/types/track";
import { UserRequest } from "../../@types/express";
import coraline from "../../database/coraline";

const userCtrl = {
  user: async (req: Request, res: Response) => {
    try {
      const { token } = req.cookies;
      if (!token) return res.status(200).json(undefined);
      const user = await getUserFromToken(token);
      if (!user) {
        res
          .clearCookie("token", {
            httpOnly: true,
          })
          .json(undefined);
      } else {
        let last_played: TrackProps[] = [];
        if (user.last_played.length >= 1) {
          await Promise.all(
            user.last_played.map(async (latestId) => {
              const latest = await Track.findOne({ _id: latestId });
              if (!latest) return;
              last_played.push(latest);
            })
          );
        }
        res.status(200).json({
          username: user.username,
          avatar: user.avatar,
          role: user.role,
          liked_tracks: user.liked_tracks,
          last_played,
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
      res.status(200).json({ tracks });
    } catch (err) {
      catchErrorCtrl(err, res);
    }
  },
  saveLastSearch: async (userRequest: Request, res: Response) => {
    try {
      console.log("started save last search");
      const req = userRequest as UserRequest;
      const { id } = req.body;
      if (!id) return res.status(400).json({ msg: "Missing id body params!" });
      const { user } = req;
      const track = await Track.findById(id);
      if (!track) return res.status(400).json({ msg: "Invalid track!" });
      if (user.last_search.length <= 1) {
        user.last_search.push(track._id);
      } else {
        const exist = user.last_search.find(
          (last_s) => last_s.toString() === track._id.toString()
        );
        console.log({exist});
        if (exist) {
          const index = user.last_search.findIndex(
            (last_s) => last_s.toString() === track._id.toString()
          );
          coraline.arrayMove(user.last_search, index, user.last_search.length);
        } else {
          user.last_search.push(track._id);
        }
      }
      await user.save();
      console.log("end  last search");
      res.status(200).json(true);
    } catch (err) {
      throw catchErrorCtrl(err, res);
    }
  },
};

export default userCtrl;
