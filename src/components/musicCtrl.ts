import { Request, Response } from "express";
import puppeteer from 'puppeteer';


const musicCtrl = {
    search: async (req: Request, res: Response) => {
        try {
            const { text } = req.body;
            console.log(text)
            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disabled-setupid-sandbox']
            });
            const page = await browser.newPage();
            await page.waitForSelector('#video-title');
            const url = `https://www.youtube.com/results?search_query=${text}`;
            await page.goto(url);
            const data = await page.evaluate(() =>
                Array.from(document.querySelectorAll("#video-title") as NodeListOf<HTMLAnchorElement>).map((title) => (
                    {title: title.title, link: title.href}
                ))
            );
            await browser.close();
            console.log(data);
            res.json(data);
        } catch (err) {
            console.log(err);
        }
    }
}

export default musicCtrl;