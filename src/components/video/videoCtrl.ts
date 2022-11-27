import fs from 'fs';
import { Request, Response } from "express";
import coraline from '../../coraline/coraline';
import { catchErrorCtrl } from '../../lib/common';

const videoCtrl = {
    sendVideo : async (req: Request, res: Response) => {
        try {
            const {name} = req.params;
            const path = coraline.use('videos');
            const video = `${path}/${name}`;
            const fsPromises = fs.promises;
            const stat = await fsPromises.stat(video);
            const fileSize = stat.size;
            const {range} = req.headers;
            if (range) {
                const parts = range.replace(/bytes=/, '').split("-");
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
                const chunksize = (end - start) + 1;
                const file = fs.createReadStream(video, {start, end});
                const head = {
                    "Content-range" : `bytes ${start}-${end}/${fileSize}`,
                    "Accept-ranges": "bytes",
                    "Content-length": chunksize,
                    "Content-Type": "video/mp4",
                    "Cache-Control": "public, max-age=1309600, s-max-age=86400, must-revalidate"
                };
                res.writeHead(200, head);
                file.pipe(res);
            } else {
                const head = {
                    "Content-Length": fileSize,
                    "Content-Type": 'video/mp4'
                };
                res.writeHead(200, head);
                fs.createReadStream(video).pipe(res);
            }
        } catch (err) {
            throw catchErrorCtrl(err, res);
        }
    },
}

export default videoCtrl;