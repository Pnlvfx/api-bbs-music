import { Router } from "express";
import playerCtrl from "./playerCtrl";

const playerRouter = Router();

playerRouter.post('/save_current', playerCtrl.saveCurrent);

export default playerRouter;
