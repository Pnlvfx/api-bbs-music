import { Router } from "express";
import auth from "../../middleware/auth";
import userCtrl from "./userCtrl";

const userRouter = Router();

userRouter.get('/', userCtrl.user);

userRouter.use(auth);

userRouter.get('/last_search', userCtrl.getLastSearch);

userRouter.post('/last_search', userCtrl.saveLastSearch);

userRouter.get('/create_queue', userCtrl.createQueue);

export default userRouter;