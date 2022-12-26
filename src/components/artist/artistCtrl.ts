import { Request, Response } from "express";
import { catchErrorCtrl } from "../../lib/common";
import { UserRequest } from "../../@types/express";
import spotifyapis from "../../lib/spotifyapis/spotifyapis";
import artist from "./artist-hooks/artist";
import Artist from "../../models/Artist";
import { ArtistProps } from "../../models/types/artist";

const artistCtrl = {
  getSimilar: async (userRequest: Request, res: Response) => {
    try {
      const req = userRequest as UserRequest;
      const { user } = req;
      const { artist: req_artist } = req.query;
      if (!req_artist)
        return res.status(400).json("Missing required query params!");
      const first = await spotifyapis.search(
        req_artist.toString(),
        "artist",
        user.countryCode
      );
      const spArtists = await spotifyapis.artist.getRelatedArtist(
        first.artists.items[0].id
      );
      let artists: ArtistProps[] = [];
      await Promise.all(
        spArtists.map(async (spArtist) => {
          let _artist = await Artist.findOne({ spID: spArtist.id });
          if (!_artist) _artist = await artist.createArtist(spArtist);
          artists.push(_artist);
        })
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
      const { liked_artists } = req.body;
      await Promise.all(
        (liked_artists as ArtistProps[]).map(async (liked_artist) => {
          if (user.liked_artists.find((_) => _.equals(liked_artist._id))) return;
          user.liked_artists.push(liked_artist._id);
        })
      );
      await user.save();
      res.status(200).json(true);
    } catch (err) {
      catchErrorCtrl(err, res);
    }
  },
  getArtist: async (userRequest: Request, res: Response) => {
    try {
      const req = userRequest as UserRequest;
      const { spID } = req.params;
      const { user } = req;
      if (!spID) return res.status(400).json({ msg: "Missing required params: spID" });
      let _artist = await Artist.findOne({spID});
      if (!_artist) {
        const spArtist = await spotifyapis.artist.getArtist(spID.toString());
        _artist = await artist.createArtist(spArtist);
      }
      const topTracks = await spotifyapis.artist.getTopTrack(
        spID,
        user.countryCode
      );
      topTracks.length = 5;
      
      const albums = await spotifyapis.artist.getArtistAlbums(
        spID,
        user.countryCode
      );
      res.status(200).json({ artist: _artist, topTracks, albums });
    } catch (err) {
      catchErrorCtrl(err, res);
    }
  },
  getTopTrack: async (userRequest: Request, res: Response) => {
    try {
      const req = userRequest as UserRequest;
      const { user } = req;
      const { spID } = req.params;
      if (!spID)
        return res.status(400).json({ msg: "Missing required params: spID" });
      const topTracks = await spotifyapis.artist.getTopTrack(
        spID,
        user.countryCode
      );
      res.status(200).json(topTracks);
    } catch (err) {
      catchErrorCtrl(err, res);
    }
  },
  createNew: async (userRequest: Request, res: Response) => {
    try {
      const req = userRequest as UserRequest;
      const { spID } = req.params;
      if (!spID)
        return res.status(400).json({ msg: "Missing required params: spID" });
      let newArtist = await Artist.findOne({ spID });
      if (!newArtist) {
        const spArtist = await spotifyapis.artist.getArtist(spID);
        newArtist = await artist.createArtist(spArtist);
      }
      res.status(200).json(newArtist);
    } catch (err) {
      catchErrorCtrl(err, res);
    }
  },
};

export default artistCtrl;
