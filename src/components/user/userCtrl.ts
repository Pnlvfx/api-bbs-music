import { Request, Response } from "express";
import { catchErrorCtrl } from "../../lib/common";
import { getUserFromToken } from "./user-hooks";

const userCtrl = {
    user: async (req: Request, res: Response) => {
        try {
            const {token} = req.cookies;
            if (!token) return res.status(200).json(null);
            const user = await getUserFromToken(token);
            res.status(200).json({
                user: {
                    username: user.username,
                    avatar: user.avatar,
                    role: user.role,
                    liked_songs: user.liked_songs
                }
            })
        } catch (err) {
            catchErrorCtrl(err, res);
        }
    }
}

export default userCtrl;
