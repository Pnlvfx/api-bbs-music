import { Response } from "express";

export const catchError = (err : unknown) => {
    if (err instanceof Error) {
        throw new Error(`${err.message}`);
    } else {
        throw new Error(`API error`);
    }
}


export const catchErrorCtrl = (err: unknown, res: Response) => {
    if (err instanceof Error) {
        res.status(500).json({msg: err.message});
    } else {
        res.status(500).json({msg: 'API error'});
    }
}