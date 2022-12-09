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
      const { text, type } = req.query;
      if (!text || !type) return res.status(400).json({ msg: 'Missing required params: "text"' });
      const data = await spotifyapis.search(text.toString(), type.toString(), user.countryCode);
      await Promise.all(
        data.tracks.items.map(async (track, index) => {
          const dbTrack = await Track.findOne({
            title: (track as SpotifyTrackProps).name,
            artist: (track as SpotifyTrackProps).artists[0].name
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
