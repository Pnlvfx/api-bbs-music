import { NextFunction, Request, Response } from "express";
import { UserRequest } from "../@types/express";
import { catchErrorCtrl } from "../lib/common"

const trackMiddleware = async (userRequest: Request, res: Response, next: NextFunction) => {
    try {
        const req = userRequest as UserRequest;
        console.log(req.originalUrl.split('/')[2].split('.mp3')[0]);
        const doStuff = async () => {

        }
        doStuff();
        next();
    } catch (err) {
        throw catchErrorCtrl(err, res);
    }
}

export default trackMiddleware;