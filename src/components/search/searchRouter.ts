import { Router } from "express";
import searchCtrl from "./searchCtrl";

const searchRouter = Router();

searchRouter.get('/artist', searchCtrl.artist);

export default searchRouter;
