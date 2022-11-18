import { Request, Response } from "express";
import { catchErrorCtrl } from "../../lib/common";
import { getUserFromToken } from "./user-hooks";

const userCtrl = {
    user: async (req: Request, res: Response) => {
        try {
            const {token} = req.cookies;
            if (!token) return res.status(200).json(undefined);
            const user = await getUserFromToken(token);
            if (!user) {
                res.clearCookie('token',{
                    httpOnly: true,
                }).json(undefined);
            } else {
                res.status(200).json({
                    username: user.username,
                    avatar: user.avatar,
                    role: user.role,
                    liked_tracks: user.liked_tracks
            });
            };
        } catch (err) {
            catchErrorCtrl(err, res);
        }
    }
}

export default userCtrl;
