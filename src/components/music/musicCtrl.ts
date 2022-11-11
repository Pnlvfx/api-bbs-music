import { Request, Response } from "express";
import puppeteer from 'puppeteer';
import { YDdownload } from "../../models/types/song";
import YoutubeMp3Downloader from "youtube-mp3-downloader";
import coraline from "../../database/coraline";
import { catchErrorCtrl } from "../../lib/common";
import Song from "../../models/Song";
import fs from 'fs';
import music from "./music-hooks/music";
import lastfmapis from "../../lib/lastfmapis/lastfmapis";


const musicCtrl = {
    search: async (req: Request, res: Response) => {
        try {
            const { text } = req.query;
            if (!text) return res.status(400).json({msg: 'Missing required params: "text"'})
            //const artists = await lastfmapis.artist.search(text.toString());
            const songs = await lastfmapis.track.search(text.toString());
            res.status(200).json({songs});
        } catch (err) {
            catchErrorCtrl(err, res);
        }
    },
    downloadMusic: async (req: Request, res: Response) => {
        try {
            const {artist, song: req_song} = req.body;
            const t = `${artist}${' '}${req_song}`;
            const text = t.replaceAll(' ', '+');
            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disabled-setupid-sandbox']
            });
            const page = await browser.newPage();
            page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36');
            const searchUrl = `https://www.youtube.com/results?search_query=${text}`;
            await page.goto(searchUrl);
            const url = await page.evaluate(() => {
                const doc = document.querySelector('#video-title') as HTMLAnchorElement;
                return doc.href;
            })
            await browser.close()
            const path = coraline.use('music');
            const id = url.split('v=')[1];
            const exists = await Song.exists({id});
            if (exists) return res.status(400).json({msg: 'This song is already in our database!'});
            const YD = new YoutubeMp3Downloader({
                outputPath: path,
                youtubeVideoQuality: 'highestaudio',
                "queueParallelism": 2,
                "progressTimeout": 2000, 
                "allowWebm": false
            });
            YD.download(id, `${id}.mp3`);
            YD.on('finished', async (err, data: YDdownload) => {
                data.title = req_song;
                data.artist = artist;
                await music.saveMusic(data);
                const song = await Song.findOne({id: data.videoId});
                res.status(200).json(song);
            });
            YD.on('error', (error) => {
                console.log(error);
            })
            YD.on('progress', (progress) => {
                console.log(JSON.stringify(progress));
            });

        } catch (err) {
            catchErrorCtrl(err, res);
        }
    },
    song: async (req: Request, res: Response) => {
        try {
            const {id} = req.params;
            const fixedId = id.split('.mp3');
            const song = await Song.findOne({id: fixedId[0]});
            if (!song) return res.status(400).json({msg: "This song doesn't exist."});
            const headers = {
                "Content-Type": "audio/mp3",
                "Cache-Control": "public, max-age=1309600, s-max-age=86400, must-revalidate"
            }
            res.writeHead(206, headers);
            const stream = fs.createReadStream(song.file);
            stream.pipe(res);
        } catch (err) {
            catchErrorCtrl(err, res);
        }
    },
    songs: async (req: Request, res: Response) => {
        try {
            const songs = await Song.find({}).sort({createdAt: -1});
            res.status(200).json(songs);
        } catch (err) {
            catchErrorCtrl(err, res);
        }
    },
}

export default musicCtrl;