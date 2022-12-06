import { Router } from "express";
import searchCtrl from "./searchCtrl";

const searchRouter = Router();

searchRouter.get('/', searchCtrl.search);

export default searchRouter;
