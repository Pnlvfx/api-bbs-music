import { Document } from "mongoose";

export interface YDdownload {
  videoId: string;
  stats: any;
  file: string;
  youtubeUrl: string;
  videoTitle: string;
  artist: string;
  title: string;
  thumbnail: string;
}

export interface YDdownloadExtended extends YDdownload {
  info: SpotifyTrackProps
}

export interface TrackProps extends Document {
  id: string;
  spID: string
  url: string;
  type: string;
  content_type: string;
  duration: number;
  title: string;
  artist: string;
  artistSpID: string;
  album?: string;
  description?: string;
  genre: string[]
  popularity: number;
  date?: string;
  artwork: string;
  file: string;
  is_saved: boolean;
}
