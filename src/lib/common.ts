import { Response } from "express";
import telegramapis from "./telegramapis/telegramapis";

export const catchError = (err : unknown) => {
    console.log(err);
    if (err instanceof Error) {
        telegramapis.sendLog(err.message)
        throw new Error(`${err.message}`);
    } else if (typeof err === 'string') {
        telegramapis.sendLog(err)
        throw new Error(err);
    } else {
        telegramapis.sendLog('API error')
        throw new Error(`API error`);
    }
}


export const catchErrorCtrl = (err: unknown, res: Response) => {
    if (err instanceof Error) {
        res.status(500).json({msg: err.message});
    } else if (typeof err === 'string') {
        res.status(500).json({msg: err});
    } else {
        res.status(500).json({msg: 'API error'});
    }
}

export const performanceEnd = (start: number) => {
    const end = performance.now();
    const time = `Request took ${end - start} milliseconds`
    return console.log(time)
}