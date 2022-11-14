import { Request, response, Response } from "express";
import { catchErrorCtrl } from "../../lib/common";
import Song from "../../models/Song";
import fs from 'fs';
import lastfmapis from "../../lib/lastfmapis/lastfmapis";
import { SearchResult } from "../../types/search";
import youtubeapis from "../../lib/youtubeapis/youtubeapis";
import { UserRequest } from "../../@types/express";
import { Types } from "mongoose";
import { SongProps } from "src/models/types/song";

const musicCtrl = {
    search: async (userRequest: Request, res: Response) => {
        try {
            const req = userRequest as UserRequest;
            const {user} = req;
            const { text } = req.query;
            if (!text) return res.status(400).json({msg: 'Missing required params: "text"'})
            const songs = await lastfmapis.track.search(text.toString());
            //const artists = await lastfmapis.artist.search(text.toString());
            let response1: SearchResult[] = [];
            await Promise.all(
                songs.map(async (song) => {
                    const dbSong = await Song.findOne({title: song.name});
                    const obj: SearchResult & {_id: Types.ObjectId | ''} = {
                        artist: dbSong ? dbSong.artist : song.artist,
                        artwork: dbSong ? dbSong.artwork : song.image[0]["#text"],
                        content_type: 'audio/mp3',
                        duration: dbSong ? dbSong.duration : 0,
                        file: dbSong ? dbSong.file : '',
                        id: dbSong ? dbSong.id : '',
                        isSaved: dbSong ? true : false,
                        title: dbSong ? dbSong.title : song.name,
                        type: 'default',
                        url: dbSong ? dbSong.url : '',
                        album: '',
                        date: '',
                        description: '',
                        genre: '',
                        _id: dbSong ? dbSong._id : ''
                    }
                    response1.push(obj);
                })
            )
            res.status(200).json({songs: response1});
        } catch (err) {
            throw catchErrorCtrl(err, res);
        }
    },
    addNextSong: async (req: Request, res: Response) => {
        try {
            const getRandomInt = (max: number) => {
                return Math.floor(Math.random() * max);
            }
            const {artist, track} = req.body;
            if (!artist || !track) return res.status(400).json({msg: 'Missing required parameters'});
            const similar = await lastfmapis.track.getSimilar(artist, track);
            if (similar.length === 0) {
                return res.status(400).json(); //transform to 200
            }
            const index = getRandomInt(similar.length);
            const song = similar[index];
            const dbSong = await Song.findOne({title: song.name});
            const savedSong = dbSong ? dbSong : await youtubeapis.downloadSong(song.artist.name, song.name);
            res.status(200).json(savedSong);
        } catch (err) {
            catchErrorCtrl(err, res);
        }
    },
    downloadMusic: async (req: Request, res: Response) => {
        try {
            const {artist, song} = req.body;
            const savedSong = await youtubeapis.downloadSong(artist, song);
            res.status(201).json(savedSong);
        } catch (err) {
            catchErrorCtrl(err, res);
        }
    },
    song: async (req: Request, res: Response) => {
        try {
            const {id} = req.params;
            const fixedId = id.split('.mp3');
            const song = await Song.findOne({id: fixedId[0]});
            if (!song) return res.status(400).json({msg: "This song doesn't exist."});
            const headers = {
                "Content-Type": "audio/mp3",
                "Cache-Control": "public, max-age=1309600, s-max-age=86400, must-revalidate"
            }
            res.writeHead(206, headers);
            const stream = fs.createReadStream(song.file);
            stream.pipe(res);
        } catch (err) {
            catchErrorCtrl(err, res);
        }
    },
    liked_songs: async (userRequest: Request, res: Response) => {
        try {
            const req = userRequest as UserRequest;
            const {user} = req;
            let response: SongProps[] = [];
            await Promise.all(
                user.liked_songs.map(async (liked) => {
                    const song = await Song.findOne({_id: liked});
                    response.push(song);
                })
            )
            console.log(response);
            res.status(200).json(response);
        } catch (err) {
            catchErrorCtrl(err, res);
        }
    },
    like: async (userRequest: Request, res: Response) => {
        try {
            const req = userRequest as UserRequest;
            let {_id} = req.body;
            if (!_id) return res.status(400).json({msg: 'Missing required params: _id'})
            const {user} = req;
            const exists = user.liked_songs.find((liked) => liked.toString() === _id);
            if (exists) {
                const filter = user.liked_songs.filter(liked => liked !== exists);
                user.liked_songs = filter;
            } else {

                user.liked_songs.push(_id);
            }
            await user.save();
            res.status(200).json(true);
        } catch (err) {
            catchErrorCtrl(err, res);
        }
    }
}

export default musicCtrl;