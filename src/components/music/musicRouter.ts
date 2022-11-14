import { Router } from "express";
import musicCtrl from "./musicCtrl";

const musicRouter = Router();

musicRouter.get('/liked_songs', musicCtrl.liked_songs);

musicRouter.get('/search', musicCtrl.search);

musicRouter.post('/get_similar', musicCtrl.addNextSong);

musicRouter.post('/download', musicCtrl.downloadMusic);

musicRouter.post('/like', musicCtrl.like);

musicRouter.get('/:id', musicCtrl.song);

export default musicRouter;