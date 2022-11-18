import express from "express";
import musicCtrl from "./musicCtrl";

const musicRouter = express.Router();

musicRouter.get('/liked', musicCtrl.liked_tracks);

musicRouter.get('/search', musicCtrl.search);

musicRouter.post('/get_similar', musicCtrl.addNextTrack);

musicRouter.post('/download', musicCtrl.downloadMusic);

musicRouter.post('/like', musicCtrl.like);

export default musicRouter;