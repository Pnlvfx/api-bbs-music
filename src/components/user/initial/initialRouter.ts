import { Router } from "express";
import initialCtrl from "./initialCtrl";

const initialRouter = Router();

initialRouter.get('/top_geo_artists', initialCtrl.getTopGeoArtist);

export default initialRouter