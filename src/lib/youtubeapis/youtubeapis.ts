import { catchError } from "../common";
import coraline from "../../coraline/coraline";
import Track from "../../models/Track";
import { TrackProps, YDdownload, YDdownloadExtended } from "../../models/types/track";
import music from "../../components/music/music-hooks/music";
import YoutubeMp3Downloader from "youtube-mp3-downloader";
import puppeteer from "puppeteer";
import spotifyapis from "../spotifyapis/spotifyapis";
import getAudioDurationInSeconds from "get-audio-duration";
import config from '../../config/config';

const youtubeapis = {
  downloadTrack: async (spID: string) => {
    try {
      return new Promise<TrackProps>(async (resolve, rejects) => {
        const trackInfo = await spotifyapis.track.getTrack(spID);
        const title = trackInfo.name === trackInfo.album.name ? trackInfo.name + ' ' + 'song' : trackInfo.name;
        const text = encodeURI(`${trackInfo.artists[0].name}+${title}`).replaceAll("%20", "+");
        const browser = await puppeteer.launch({
          args: ["--no-sandbox", "--disabled-setupid-sandbox"],
        });
        const page = await browser.newPage();
        await page.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36"
        );
        const searchUrl = `https://www.youtube.com/results?search_query=${text}`;
        await page.goto(searchUrl);
        await page.waitForSelector("#video-title");
        const url = await page.evaluate(() => {
          const doc = document.querySelector(
            "#video-title"
          ) as HTMLAnchorElement;
          if (!doc?.href) return null;
          return doc.href;
        });
        if (!url) return rejects("Href not found!");
        browser.close(); //promise but not important to await
        const id = url.split("v=")[1];
        const existing = await Track.findOne({ id });
        if (existing) return resolve(existing);
        const path = coraline.use("music");
        const YD = new YoutubeMp3Downloader({
          outputPath: path,
          youtubeVideoQuality: "highestaudio",
          queueParallelism: 2,
          progressTimeout: 2000,
          allowWebm: false,
        });
        YD.download(id, `${id}.mp3`);
        YD.on("finished", async (err, data: YDdownloadExtended) => {
          if (err) return rejects(err);
          try {
            trackInfo.name.replace('+song', '');
            data.info = trackInfo;
            const savedTrack = await music.saveMusic(data);
            return resolve(savedTrack);
          } catch (err) {
            console.log(err, "from youtubeapis track: ", data.title);
            throw rejects(err);
          }
        });
        YD.on("error", (error) => {
          return rejects(error);
        });
        YD.on("progress", (progress) => {
          progress = progress;
        });
      });
    } catch (err) {
      throw catchError(err);
    }
  },
  getIDfromUrl: (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[7].length == 11) {
      return match[7]
    } else {
      return null;
    }
  },
  downloadFromId: (id: string) => {
    try {
      return new Promise(async (resolve, rejects) => {
        const existing = await Track.findOne({ id });
        if (existing) return resolve(existing);
        const path = coraline.use("music");
        const YD = new YoutubeMp3Downloader({
          outputPath: path,
          youtubeVideoQuality: "highestaudio",
          queueParallelism: 2,
          progressTimeout: 2000,
          allowWebm: false,
        });
        YD.download(id, `${id}.mp3`);
        YD.on("finished", async (err, data: YDdownload) => {
          if (err) return rejects(err);
          try {
            const duration = await getAudioDurationInSeconds(data.file);
            const url = `${config.SERVER_URL}/music/${data.videoId}.mp3`;
            const track = new Track({
              id: data.videoId,
              url,
              type: "default",
              content_type: "audio/mp3",
              duration,
              title: data.title,
              artist: data.artist,
              artistSpID: undefined,
              album: '',
              description: "",
              genre: [],
              popularity: undefined,
              date: undefined,
              artwork: data.thumbnail,
              file: data.file,
              spID: undefined,
              is_saved: true,
            });
            await track.save();
            return resolve(track);
          } catch (err) {
            console.log(err, "from youtubeapis.downloadFromId track: ", data.title);
            throw rejects(err);
          }
        });
        YD.on("error", (error) => {
          return rejects(error);
        });
        YD.on("progress", (progress) => {
          progress = progress;
        });
      });
    } catch (err) {
      throw catchError(err);
    }
  }
};

export default youtubeapis;
