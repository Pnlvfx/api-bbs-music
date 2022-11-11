import { Router } from "express";
import oauthCtrl from "./oauthCtrl";

const oauthRouter = Router();

oauthRouter.post('/google_login', oauthCtrl.googleLogin);

oauthRouter.post('/logout', oauthCtrl.logout);

export default oauthRouter;
