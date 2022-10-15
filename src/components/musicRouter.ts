import { Router } from "express";
import musicCtrl from "./musicCtrl";

const musicRouter = Router();

musicRouter.post('/search', musicCtrl.search);

export default musicRouter;