import { NextFunction, Request, Response } from "express";
import { getUserFromToken } from "../components/user/user-hooks";
import { UserRequest } from "../@types/express";
import { catchErrorCtrl } from "../lib/common"

const auth = async (userRequest: Request, res: Response, next: NextFunction) => {
    try {
        const req = userRequest as UserRequest;
        const {token} = req.cookies;
        if (!token) return res.status(401).json({msg: 'This API require user authentication'});
        const user = await getUserFromToken(token);
        if (!user) {
            res.clearCookie('token', {
                httpOnly: true,
            }).json(null);
        } else {
            req.user = user;
            next();
        };
    } catch (err) {
        throw catchErrorCtrl(err, res);
    }
}

export default auth;