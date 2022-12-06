import { Document, Types } from "mongoose";

export interface PlayerProps extends Document {
  previous: Types.ObjectId[];
  current: {
    track: Types.ObjectId;
    from: "initial" | "home" | "search" | "library";
  };
  next: Types.ObjectId[];
}
