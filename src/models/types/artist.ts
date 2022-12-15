import { Document } from "mongoose";

export interface ArtistProps extends Document {
  followers: { total: number };
  genres: string[];
  spID: string;
  images: SpotifyImageProps[];
  name: string;
  popularity: number;
  type: string;
}
