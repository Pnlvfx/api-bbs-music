import { NextFunction, Request, Response } from "express";
import { UserRequest } from "../@types/express";
import { catchErrorCtrl } from "../lib/common";
import { usePlayer } from "../lib/playerapis/hooks/playerHooks";
import playerapis from "../lib/playerapis/playerapis";
import Track from "../models/Track";

const trackMiddleware = async (
  userRequest: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const req = userRequest as UserRequest;
    const id = req.originalUrl.split("/")[2].split(".mp3")[0]
    const { user } = req;
    const doStuff = async () => {
      try {
        const player = await usePlayer(user.player);
        const track = await Track.findOne({id});
        if (!track) return res.status(400).json({msg: 'Invalid track!'});
        playerapis.saveToRecentlyPlayed(player, track._id);
        player.current.track = track._id
        await player.save();
        console.log(track.title, "is the current track");
      } catch (err) {
        console.log(err);
      }
    };
    doStuff();
    next();
  } catch (err) {
    catchErrorCtrl(err, res);
  }
};

export default trackMiddleware;
