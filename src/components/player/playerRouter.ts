import { Router } from "express";
import playerCtrl from "./playerCtrl";

const playerRouter = Router();

playerRouter.post('/save_current', playerCtrl.saveCurrent);

playerRouter.get('/add_to_queue', playerCtrl.addToQueue);

export default playerRouter;
