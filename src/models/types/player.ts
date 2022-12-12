import { Document, Types } from "mongoose";

export interface PlayerProps extends Document {
  recently_played: Types.ObjectId[];
  previous: Types.ObjectId[];
  current: {
    track: Types.ObjectId;
    from: string
  };
  next: Types.ObjectId[];
  queue: Types.ObjectId[];
}
