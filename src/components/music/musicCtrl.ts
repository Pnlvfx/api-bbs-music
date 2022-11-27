import { Request, Response } from "express";
import { catchErrorCtrl } from "../../lib/common";
import Track from "../../models/Track";
import lastfmapis from "../../lib/lastfmapis/lastfmapis";
import youtubeapis from "../../lib/youtubeapis/youtubeapis";
import { UserRequest } from "../../@types/express";
import { TrackObject } from "../../models/types/track";
import trackapis from "../../lib/trackapis/trackapis";
import coraline from "../../coraline/coraline";

const musicCtrl = {
  search: async (userRequest: Request, res: Response) => {
    try {
      const req = userRequest as UserRequest;
      const { text } = req.query;
      if (!text)
        return res.status(400).json({ msg: 'Missing required params: "text"' });
      const tracks = await lastfmapis.track.search(text.toString());
      //const artists = await lastfmapis.artist.search(text.toString());
      let response1: TrackObject[] = [];
      await Promise.all(
        tracks.map(async (track) => {
          const dbTrack = await Track.findOne({ title: track.name });
          const obj: TrackObject = {
            artist: dbTrack ? dbTrack.artist : track.artist,
            artwork: dbTrack ? dbTrack.artwork : track.image[0]["#text"],
            content_type: "audio/mp3",
            duration: dbTrack ? dbTrack.duration : 0,
            file: dbTrack ? dbTrack.file : "",
            id: dbTrack ? dbTrack.id : "",
            is_saved: dbTrack ? true : false,
            title: dbTrack ? dbTrack.title : track.name,
            type: "default",
            url: dbTrack ? dbTrack.url : "",
            album: "",
            date: "",
            description: "",
            genre: "",
            _id: dbTrack ? dbTrack._id : undefined,
            liked: false,
          };
          response1.push(obj);
        })
      );
      res.status(200).json({ tracks: response1 });
    } catch (err) {
      throw catchErrorCtrl(err, res);
    }
  },
  addNextTrack: async (userRequest: Request, res: Response) => {
    try {
      const req = userRequest as UserRequest;
      const {user} = req;
      const random = coraline.getRandomInt(user.player.next.length);
      const nextTrackID = user.player.next[random];
      const nextTrack = await Track.findById(nextTrackID);
      if (!nextTrack) return res.status(400).json({msg: 'User queue is empty'});
      res.status(200).json(nextTrack);
      const deleteFromQueue = user.player.next.filter(item => item._id.toString() !== nextTrackID.toString());
      user.player.next = deleteFromQueue;
      if (user.player.next.length >= 100) return
      const newTrack = await trackapis.addNext(nextTrack?.artist, nextTrack?.title);
      user.player.next.push(newTrack._id);
      await user.save();
    } catch (err) {
      console.log(err, 'addNextSong');
    }
  },
  downloadMusic: async (userRequest: Request, res: Response) => {
    try {
      const req = userRequest as UserRequest;
      const { artist, track } = req.body;
      if (!artist || !track)
        return res.status(400).json({ msg: "Missing required body params!" });
      const savedTrack = await youtubeapis.downloadTrack(
        artist,
        track.toString()
      );
      res.status(201).json(savedTrack);
    } catch (err) {
      console.log(err, 'downloadMusic catch');
      catchErrorCtrl(err, res);
    }
  },
  liked_tracks: async (userRequest: Request, res: Response) => {
    try {
      const req = userRequest as UserRequest;
      const { user } = req;
      const tracks = await Track.find({_id: user.liked_tracks});
      res.status(200).json(tracks);
    } catch (err) {
      catchErrorCtrl(err, res);
    }
  },
  like: async (userRequest: Request, res: Response) => {
    try {
      const req = userRequest as UserRequest;
      const { _id } = req.body;
      if (!_id) return res.status(400).json({ msg: "Missing required params: _id" });
      const { user } = req;
      const exists = user.liked_tracks.find(
        (liked) => liked.toString() === _id
      );
      if (exists) {
        const filter = user.liked_tracks.filter((liked) => liked !== exists);
        user.liked_tracks = filter;
      } else {
        user.liked_tracks.push(_id);
      }
      await user.save();
      res.status(200).json(true);
    } catch (err) {
      catchErrorCtrl(err, res);
    }
  },
};

export default musicCtrl;
