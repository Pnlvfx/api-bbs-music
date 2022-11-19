import { Request, Response } from "express";
import { catchErrorCtrl } from "../../lib/common";
import Track from "../../models/Track";
import lastfmapis from "../../lib/lastfmapis/lastfmapis";
import youtubeapis from "../../lib/youtubeapis/youtubeapis";
import { UserRequest } from "../../@types/express";
import { Types } from "mongoose";
import { TrackProps } from "../../models/types/track";
import coraline from "../../database/coraline";

const musicCtrl = {
  search: async (userRequest: Request, res: Response) => {
    try {
      const req = userRequest as UserRequest;
      const { text } = req.query;
      if (!text)
        return res.status(400).json({ msg: 'Missing required params: "text"' });
      const tracks = await lastfmapis.track.search(text.toString());
      //const artists = await lastfmapis.artist.search(text.toString());
      let response1: TrackProps[] = [];
      await Promise.all(
        tracks.map(async (track) => {
          const dbTrack = await Track.findOne({ title: track.name });
          const obj: TrackProps & { _id: Types.ObjectId | "" } = {
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
            _id: dbTrack ? dbTrack._id : "",
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
      const { artist, track } = req.body;
      if (!artist || !track) return res.status(400).json({ msg: "Missing required parameters" });
      const similar = await lastfmapis.track.getSimilar(artist, track);
      if (similar.length === 0) {
        console.log("FM API does not find similar song!");
        return res.status(400).json({ msg: "Cannot fint similar tracks" });
      }
      const index = coraline.getRandomInt(similar.length);
      const song = similar[index];
      const dbSong = await Track.findOne({ title: song.name });
      const savedSong = dbSong ? dbSong : await youtubeapis.downloadTrack(song.artist.name, song.name);
      res.status(200).json(savedSong);
    } catch (err) {
      console.log(err, 'catched');
      catchErrorCtrl(err, res);
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
      console.log(err);
      catchErrorCtrl(err, res);
    }
  },
  liked_tracks: async (userRequest: Request, res: Response) => {
    try {
      const req = userRequest as UserRequest;
      const { user } = req;
      let response: TrackProps[] = [];
      await Promise.all(
        user.liked_tracks.map(async (likedId) => {
          const track = await Track.findOne({ _id: likedId });
          if (!track) return;
          response.push(track);
        })
      );
      res.status(200).json(response);
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
