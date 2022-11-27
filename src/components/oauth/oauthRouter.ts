import { Router } from "express";
import oauthCtrl from "./oauthCtrl";

const oauthRouter = Router();

oauthRouter.post('/register', oauthCtrl.register);

oauthRouter.post('/check_email', oauthCtrl.checkEmail);

oauthRouter.post('/google_login', oauthCtrl.googleLogin);

oauthRouter.post('/logout', oauthCtrl.logout);

export default oauthRouter;
