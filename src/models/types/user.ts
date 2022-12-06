import { Document, Types } from "mongoose";

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  role: number;
  avatar: string;
  player: Types.ObjectId;
  liked_tracks: Types.ObjectId[];
  last_search: Types.ObjectId[];
  last_played: Types.ObjectId[];
  liked_artists: LikedArtistProps[]
  country: string;
  countryCode: string;
  city: string;
  region: string;
  lat: string;
  lon: string;
}

type LikedArtistProps = {
  name: string
  spID: string
}
