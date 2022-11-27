import { NextFunction, Request, Response } from "express";
import Track from "../models/Track";
import { UserRequest } from "../@types/express";
import { catchErrorCtrl } from "../lib/common"
import coraline from "../coraline/coraline";

const lastPlayed = async (userRequest: Request, res: Response, next: NextFunction) => {
    try {
        const req = userRequest as UserRequest;
        const {user} = req as UserRequest;
        const requested = req.originalUrl;
        const id = requested.split('/')[2].replace('.mp3', '');
        const track = await Track.findOne({id});
        if (!track) return res.status(400).json({msg: 'Invalid track'});
        const exist = user.last_played.find((last_p) => last_p.toString() === track._id.toString());
        if (exist) {
            const index = user.last_played.findIndex((last_p) => last_p.toString() === track._id.toString());
            coraline.arrayMove(user.last_played, index, user.last_played.length);
        } else {
            if (user.last_played.length >= 50) {
                user.last_played.shift();
            }
            user.last_played.push(track._id);
        }
        await user.save();
        return next();
    } catch (err) {
        throw catchErrorCtrl(err, res);
    }
}

export default lastPlayed;