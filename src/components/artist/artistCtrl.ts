import { Request, Response } from "express";
import lastfmapis from "../../lib/lastfmapis/lastfmapis";
import { catchErrorCtrl } from "../../lib/common";
import { UserRequest } from "../../@types/express";
import { FMartistSearch } from "../../lib/lastfmapis/types/FMartist";
import spotifyapis from "../../lib/spotifyapis/spotifyapis";

const artistCtrl = {
  getSimilar: async (userRequest: Request, res: Response) => {
    try {
      const req = userRequest as UserRequest;
      const {artist} = req.query;
      if (!artist) return res.status(400).json('Missing required query params!');
      const first = await spotifyapis.search(artist?.toString(), "artist");
      const artists = await spotifyapis.artist.getRelatedArtist(first.artists.items[0].id);
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
      (liked_artist as FMartistSearch[]).map((liked) => {
        const exist = user.liked_artists.find(
          (liked2) => liked2 === liked.name
        );
        if (exist) {
          user.liked_artists.filter((item) => item !== liked.name);
        } else {
          user.liked_artists.push(liked.name);
        }
      });
      await user.save();
      res.status(200).json(true);
    } catch (err) {
      catchErrorCtrl(err, res);
    }
  },
};

export default artistCtrl;
