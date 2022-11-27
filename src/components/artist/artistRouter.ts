import { Router } from "express";
import artistCtrl from "./artistCtrl";

const artistRouter = Router();

artistRouter.get('/similar', artistCtrl.getSimilar);

artistRouter.post('/liked', artistCtrl.liked_artist);

export default artistRouter;
