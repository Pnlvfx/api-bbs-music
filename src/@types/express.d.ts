import { Request } from "express";
import { TrackProps } from "src/models/types/track";
import { IUser } from "../models/types/user";

interface UserRequest extends Request {
    user: IUser
}