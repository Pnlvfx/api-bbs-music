import { Router } from "express";
import userCtrl from "./userCtrl";

const userRouter = Router();

userRouter.get('/', userCtrl.user);

export default userRouter;