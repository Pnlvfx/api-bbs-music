import { Document } from "mongoose";
import { FMTrackInfo } from "../../lib/lastfmapis/types/FMtrackInfo";

export interface YDdownload {
  videoId: string;
  stats: any;
  file: string;
  youtubeUrl: string;
  videoTitle: string;
  artist: string;
  title: string;
  thumbnail: string;
  info: FMTrackInfo;
}

export interface TrackProps extends Document {
  id: string;
  url: string;
  type: string;
  content_type: string;
  duration: number;
  title: string;
  artist: string;
  album?: string;
  description?: string;
  genre?: string;
  date?: string;
  artwork: string;
  file: string;
  liked: boolean;
  is_saved: boolean;
}
