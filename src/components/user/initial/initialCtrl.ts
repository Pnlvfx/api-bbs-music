import { Request, Response } from "express";
import { catchErrorCtrl } from "../../../lib/common";
import { UserRequest } from "../../../@types/express";
import lastfmapis from "../../../lib/lastfmapis/lastfmapis";

const initialCtrl = {
  getTopGeoArtist: async (userRequest: Request, res: Response) => {
    try {
      const req = userRequest as UserRequest;
      const { user } = req;
      const topArtists = await lastfmapis.artist.getTopGeoArtist(user.country);
      res.status(200).json(topArtists);
    } catch (err) {
      catchErrorCtrl(err, res);
    }
  },
  
};

export default initialCtrl;
