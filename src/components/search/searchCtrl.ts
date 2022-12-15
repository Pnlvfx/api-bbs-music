import { Request, Response } from "express";
import Track from "../../models/Track";
import { UserRequest } from "../../@types/express";
import { catchErrorCtrl, performanceEnd } from "../../lib/common";
import spotifyapis from "../../lib/spotifyapis/spotifyapis";
import { SpotifySearchProps } from "../../lib/spotifyapis/types/search";

const getDBtracks = async (data: SpotifySearchProps) => {
  const spID = Array.from(data.tracks.items.map((_) => (_ as SpotifyTrackProps).id));
  const dbTracks = await Track.find({spID});
  dbTracks.map((dbtrack) => {
    const index = data.tracks.items.findIndex((_) => _.id === dbtrack.spID);
    data.tracks.items[index] = dbtrack
  });
}

const searchCtrl = {
  search: async (userRequest: Request, res: Response) => {
    try {
      const start = performance.now();
      const req = userRequest as UserRequest;
      const {user} = req;
      const { text, type, offset } = req.query;
      const limit = req.query.limit ? req.query.limit : 20;
      if (!text || !type) return res.status(400).json({ msg: 'Missing required params: "text || type"' });
      const data = await spotifyapis.search(text.toString(), type.toString(), user.countryCode, Number(limit.toString()), Number(offset?.toString()));
      if (type.toString().includes('track')) {
        await getDBtracks(data);
      }
      res.status(200).json(data);
      performanceEnd(start, 'search');
    } catch (err) {
      catchErrorCtrl(err, res);
    }
  },
};

export default searchCtrl;
