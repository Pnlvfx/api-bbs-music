import { Router } from "express";
import artistCtrl from "./artistCtrl";

const artistRouter = Router();

artistRouter.get('/similar', artistCtrl.getSimilar);

artistRouter.post('/liked', artistCtrl.liked_artist);

artistRouter.get('/:spId/top-tracks', artistCtrl.getTopTrack);

artistRouter.get('/:spId', artistCtrl.getArtist);

export default artistRouter;
