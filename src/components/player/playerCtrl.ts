import { Request, Response } from "express";
import Track from "../../models/Track";
import { UserRequest } from "../../@types/express";
import { catchErrorCtrl } from "../../lib/common";

const playerCtrl = {
    saveCurrent: async (userRequest: Request, res: Response) => {
        try {
            const req = userRequest as UserRequest;
            const {currentID} = req.body;
            const check = await Track.findById(currentID);
            if (!check) return res.status(400).json({msg: 'Invalid current song!'});
            const {user} = req;
            user.player.current = check._id
            await user.save();
            console.log(check.title, 'is the current track')
            console.log()
            res.status(200).json(true);
        } catch (err) {
            catchErrorCtrl(err, res);
        }
    }
}

export default playerCtrl;
