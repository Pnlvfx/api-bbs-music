import { catchError } from "../common";
import coraline from "../../coraline/coraline";
import Track from "../../models/Track";
import { TrackProps, YDdownload } from "../../models/types/track";
import music from "../../components/music/music-hooks/music";
import YoutubeMp3Downloader from "youtube-mp3-downloader";
import puppeteer from "puppeteer";
import spotifyapis from "../spotifyapis/spotifyapis";

const youtubeapis = {
  downloadTrack: async (artist: string, track: string, spID: string) => {
    try {
      return new Promise<TrackProps>(async (resolve, rejects) => {
        const t = `${artist.replaceAll("&", "")}${" "}${track.replaceAll(
          "&",
          ""
        )}`;
        const text = t.replaceAll(" ", "+");
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
        await page.waitForNetworkIdle();
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
        YD.on("finished", async (err, data: YDdownload) => {
          if (err) return rejects(err);
          const trackInfo = await spotifyapis.track.getTrack(spID);
          data.info = trackInfo;
          const savedTrack = await music.saveMusic(data);
          return resolve(savedTrack);
        });
        YD.on("error", (error) => {
          return rejects(error);
        });
        YD.on("progress", (progress) => {
          //console.log(JSON.stringify(progress));
        });
      });
    } catch (err) {
      throw catchError(err);
    }
  },
};

export default youtubeapis;
