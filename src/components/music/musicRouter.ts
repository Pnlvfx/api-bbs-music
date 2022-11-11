import { Router } from "express";
import musicCtrl from "./musicCtrl";

const musicRouter = Router();

musicRouter.get('/', musicCtrl.songs);

musicRouter.get('/search', musicCtrl.search);

musicRouter.post('/download', musicCtrl.downloadMusic);

musicRouter.get('/:id', musicCtrl.song);

export default musicRouter;