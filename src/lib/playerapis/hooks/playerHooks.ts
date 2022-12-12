import { Types } from "mongoose";
import { catchError } from "../../../lib/common";
import Player from "../../../models/Player";

export const usePlayer = async (playerId: Types.ObjectId) => {
    try {
      const player = await Player.findById(playerId);
      if (!player) throw new Error('Player not found! Please contact support!');
      return player; 
    } catch (err) {
      throw catchError(err);
    }
  }