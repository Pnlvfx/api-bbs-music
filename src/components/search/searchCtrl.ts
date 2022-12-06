import { Request, Response } from "express";
import Track from "../../models/Track";
import { UserRequest } from "../../@types/express";
import { catchErrorCtrl } from "../../lib/common";
import spotifyapis from "../../lib/spotifyapis/spotifyapis";

const searchCtrl = {
  search: async (userRequest: Request, res: Response) => {
    try {
      const req = userRequest as UserRequest;
      const {user} = req;
      const { text } = req.query;
      if (!text) return res.status(400).json({ msg: 'Missing required params: "text"' });
      const data = await spotifyapis.search(text.toString(), "artist,track", user.countryCode);
      await Promise.all(
        data.tracks.items.map(async (track, index) => {
          const dbTrack = await Track.findOne({
            title: (track as SpotifyTrackProps).name,
          });
          if (dbTrack) {
            data.tracks.items[index] = dbTrack;
          }
        })
      );
      res.status(200).json(data);
    } catch (err) {
      catchErrorCtrl(err, res);
    }
  },
};

export default searchCtrl;
