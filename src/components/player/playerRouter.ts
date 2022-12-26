import { Router } from "express";
import playerCtrl from "./playerCtrl";

const playerRouter = Router();

playerRouter.post('/save_from', playerCtrl.saveFrom);

playerRouter.get('/add_to_queue', playerCtrl.addToQueue);

export default playerRouter;
