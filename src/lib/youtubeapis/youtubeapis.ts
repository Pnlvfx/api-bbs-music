import { catchError } from "../common";
import puppeteer from 'puppeteer';
import coraline from "../../database/coraline";
import Song from "../../models/Song";
import { SongProps, YDdownload } from "../../models/types/song";
import music from "../../components/music/music-hooks/music";
import YoutubeMp3Downloader from "youtube-mp3-downloader";
import lastfmapis from "../lastfmapis/lastfmapis";

const youtubeapis = {
    downloadSong: async (artist: string, track: string) => {
        try {
            return new Promise<SongProps>(async (resolve, reject) => {
                const t = `${artist}${' '}${track}`;
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
                if (exists) throw new Error('This song is already in our database!');
                const YD = new YoutubeMp3Downloader({
                    outputPath: path,
                    youtubeVideoQuality: 'highestaudio',
                    "queueParallelism": 2,
                    "progressTimeout": 2000, 
                    "allowWebm": false
                });
                YD.download(id, `${id}.mp3`);
                YD.on('finished', async (err, data: YDdownload) => {
                    if (err) {
                        reject(err);
                    }
                    data.title = track;
                    data.artist = artist;
                    const trackInfo = await lastfmapis.track.getInfo(artist, track);
                    data.info = trackInfo;
                    const savedSong = await music.saveMusic(data);
                    resolve(savedSong);
                });
                YD.on('error', (error) => {
                    console.log(error);
                    reject(error);
                })
                YD.on('progress', (progress) => {
                    console.log(JSON.stringify(progress));
                });
            })
        } catch (err) {
            throw catchError(err);
        }
    }
}

export default youtubeapis;