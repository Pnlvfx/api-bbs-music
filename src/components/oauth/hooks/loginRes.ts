import { CookieOptions, Response } from "express";
import { IUser } from "../../../models/types/user";
import jwt from 'jsonwebtoken'
import config from '../../../config/config';

export const loginRes = (user: IUser, res: Response) => {
  const token = jwt.sign({ id: user._id }, config.SECRET);
  const maxAge = 63072000000;
  let cookieOptions: CookieOptions = {
    httpOnly: true,
    maxAge,
  };
  if (config.NODE_ENV === "production") {
    cookieOptions.domain = config.COOKIE_DOMAIN;
    cookieOptions.secure = true;
  }
  res.cookie("token", token, cookieOptions).json({
    msg: "Successfully logged in!",
    user: {
      username: user.username,
      avatar: user.avatar,
      role: user.role,
    },
  });
};
