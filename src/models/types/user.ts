import { Document, Types } from "mongoose";

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  role: number;
  avatar: string;
  player: UserPlayerProps
  liked_tracks: Types.ObjectId[];
  last_search: Types.ObjectId[];
  last_played: Types.ObjectId[];
  liked_artists: string[];
  country: string;
  countryCode: string;
  city: string;
  region: string;
  lat: string;
  lon: string;
}

type UserPlayerProps = {
  previous: Types.ObjectId[]
  current: {
    track: Types.ObjectId,
    from: 'initial' | 'home' | 'search' | 'library'
  }
  next: Types.ObjectId[]
}
