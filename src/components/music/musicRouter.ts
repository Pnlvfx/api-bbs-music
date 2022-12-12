import express from "express";
import musicCtrl from "./musicCtrl";

const musicRouter = express.Router();

musicRouter.get('/get_next', musicCtrl.getNextTrack);

musicRouter.post('/download', musicCtrl.downloadMusic);

musicRouter.post('/like', musicCtrl.like);

export default musicRouter;