import { Router } from "express";
import artistCtrl from "./artistCtrl";

const artistRouter = Router();

artistRouter.get('/similar', artistCtrl.getSimilar);

artistRouter.post('/liked', artistCtrl.liked_artist);

artistRouter.get('/:spID/top-tracks', artistCtrl.getTopTrack);

artistRouter.get('/:spID/new', artistCtrl.createNew);

artistRouter.get('/:spID', artistCtrl.getArtist);

export default artistRouter;
