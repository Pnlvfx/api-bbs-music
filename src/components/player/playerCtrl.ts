import { Request, Response } from "express";
import Track from "../../models/Track";
import { UserRequest } from "../../@types/express";
import { catchErrorCtrl } from "../../lib/common";
import { usePlayer } from "../../lib/playerapis/hooks/playerHooks";

const playerCtrl = {
    addToQueue: async (userRequest: Request, res: Response) => {
        try {
            const req = userRequest as UserRequest;
            const {user} = req;
            const {_id} = req.query;
            const track = await Track.findById(_id);
            if (!track) return res.status(400).json({msg: 'Something went wrong!'});
            const player = await usePlayer(user.player);
            player.queue.push(track._id);
            await player.save();
            res.status(200).json(true);
        } catch (err) {
            catchErrorCtrl(err, res);
        }
    },
    saveFrom: async (userRequest: Request, res: Response) => {
        try {
            const req = userRequest as UserRequest;
            const {user} = req;
            const player = await usePlayer(user.player);
            const {from} = req.body;
            player.current.from = from;
            await player.save();
            console.log('playing from:', player.current.from);
            res.status(200).json(from);
        } catch (err) {
            catchErrorCtrl(err, res);
        }
    }
    
}

export default playerCtrl;
