import { Request, Response } from "express";
import lastfmapis from "../../lib/lastfmapis/lastfmapis";
import { UserRequest } from "../../@types/express";
import { catchErrorCtrl } from "../../lib/common";

const searchCtrl = {
    artist: async (userRequest: Request, res: Response) => {
        try {
            const req = userRequest as UserRequest;
            const {text} = req.query;
            if (!text) return res.status(400).json({ msg: 'Missing required params: "text"' });
            const artists = await lastfmapis.artist.search(text.toString());
            res.status(200).json({artists});
        } catch (err) {
            catchErrorCtrl(err, res);
        }
    }
}

export default searchCtrl;