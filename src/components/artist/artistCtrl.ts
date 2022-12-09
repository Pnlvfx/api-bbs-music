import { Request, Response } from "express";
import { catchErrorCtrl } from "../../lib/common";
import { UserRequest } from "../../@types/express";
import spotifyapis from "../../lib/spotifyapis/spotifyapis";

const artistCtrl = {
  getSimilar: async (userRequest: Request, res: Response) => {
    try {
      const req = userRequest as UserRequest;
      const { user } = req;
      const { artist } = req.query;
      if (!artist) return res.status(400).json("Missing required query params!");
      const first = await spotifyapis.search(
        artist?.toString(),
        "artist",
        user.countryCode
      );
      const artists = await spotifyapis.artist.getRelatedArtist(
        first.artists.items[0].id
      );
      res.status(200).json(artists);
    } catch (err) {
      catchErrorCtrl(err, res);
    }
  },
  liked_artist: async (userRequest: Request, res: Response) => {
    try {
      const req = userRequest as UserRequest;
      const { user } = req;
      const { liked_artist } = req.body;
      (liked_artist as SpotifyArtistProps[]).map((liked) => {
        const exist = user.liked_artists.find((_) => _.spID === liked.id);
        if (exist) return;
        user.liked_artists.push({name: liked.name, spID: liked.id});
      });
      await user.save();
      res.status(200).json(true);
    } catch (err) {
      catchErrorCtrl(err, res);
    }
  },
};

export default artistCtrl;
