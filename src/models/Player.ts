import { Schema, model } from "mongoose";
import { PlayerProps } from "./types/player";

const PlayerSchema = new Schema<PlayerProps>({
  previous: {
    type: [Schema.Types.ObjectId],
  },
  current: {
    track: {
      type: Schema.Types.ObjectId,
    },
    from: String,
  },
  next: {
    type: [Schema.Types.ObjectId],
  },
}, {
  versionKey: false
});

const Player = model("Player", PlayerSchema);

export default Player;
