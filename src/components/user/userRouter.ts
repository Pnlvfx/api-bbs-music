import { Router } from "express";
import auth from "../../middleware/auth";
import playerRouter from "../player/playerRouter";
import userCtrl from "./userCtrl";

const userRouter = Router();

userRouter.get('/', userCtrl.user);

userRouter.use(auth);

userRouter.get('/last_search', userCtrl.getLastSearch);

userRouter.post('/last_search', userCtrl.saveLastSearch);

userRouter.get('/clear_last_search', userCtrl.clearLastSearch);

userRouter.get('/create_queue', userCtrl.createQueue);

userRouter.use('/player', playerRouter);

export default userRouter;