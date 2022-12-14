import { CookieOptions, Request, Response } from "express";
import config from "../../config/config";
import bcrypt from "bcrypt";
import User from "../../models/User";
import { catchErrorCtrl } from "../../lib/common";
import jwt from "jsonwebtoken";
import userapis from "../../lib/userapis";
import coraline from "../../coraline/coraline";
import Player from "../../models/Player";
import { loginRes } from "./hooks/loginRes";

const oauthCtrl = {
  checkEmail: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!coraline.validateEmail(email)) return res.status(200).json(false);
      const existingEmail = await User.findOne({ email });
      if (existingEmail) return res.status(400).json(false);
      res.status(200).json(true);
    } catch (err) {
      catchErrorCtrl(err, res);
    }
  },
  checkUsername: async (req: Request, res: Response) => {
    try {
      const { username } = req.body;
      if (username.length < 6) return res.status(200).json(false);
      if ((username as string).includes(' ')) return res.status(200).json(false);
      const existingUser = await User.findOne({ username });
      if (existingUser) return res.status(200).json(false);
      res.status(200).json(true);
    } catch (err) {
      catchErrorCtrl(err, res);
    }
  },
  register: async (req: Request, res: Response) => {
    try {
      const { email, username, password } = req.body;
      if (!username || !email || !password)
        return res.status(400).json({ msg: "Please fill in all fields" });
      if (!userapis.validateEmail(email))
        return res.status(400).json({ msg: "Not a valid email address" });
      const existingEmail = await User.findOne({ email });
      if (existingEmail)
        return res.status(400).json({ msg: "This email already exist!" });
      if (password.length < 8)
        return res
          .status(400)
          .json({ msg: "Password must be at least 8 characters long." });
      const existingUser = await User.findOne({ username });
      if (existingUser)
        return res.status(400).json({ msg: "This username already exist!" });
      const passwordHash = bcrypt.hashSync(password, 10);
      const userIPInfo = await userapis.getIP();
      const { country, countryCode, city, region, lat, lon } = userIPInfo;
      const player = new Player();
      await player.save();
      const user = new User({
        email,
        username,
        password: passwordHash,
        player: player._id,
        country,
        countryCode,
        city,
        region,
        lat,
        lon,
      });
      await user.save();
      loginRes(user, res);
    } catch (err) {
      catchErrorCtrl(err, res);
    }
  },
  login: async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({
        username: new RegExp(`^${username}$`, "i"),
      });
      if (user) {
        const passOk = bcrypt.compareSync(password, user.password);
        if (passOk) {
          loginRes(user, res);
        } else {
          return res.status(422).json({msg: "This password is incorrect!"});
        }
      } else {
        return res.status(422).json({msg: "This username doesn't exist!"});
      }
    } catch (err) {
      catchErrorCtrl(err, res);
    }
  },
  logout: async (req: Request, res: Response) => {
    try {
      res
        .clearCookie("token", {
          httpOnly: true,
        })
        .send();
    } catch (err) {
      catchErrorCtrl(err, res);
    }
  },
  googleLogin: async (req: Request, res: Response) => {
    try {
      const {
        email,
        username: name,
        avatar,
        country,
        countryCode,
        city,
        region,
        lat,
        lon,
      } = req.body;
      let user = await User.findOne({ email });
      const password = email + config.GOOGLE_SECRET;
      const passwordHash = bcrypt.hashSync(password, 10);
      if (user) {
        const match = bcrypt.compareSync(password, user.password);
        if (!match)
          return res.status(400).json({ msg: "Password is incorrect!" });
      } else {
        const username = name.replace(/\s/g, "");
        user = new User({
          username,
          email,
          password: passwordHash,
          country,
          countryCode,
          city,
          region,
          lat,
          lon,
        });
        await user.save();
      }
      const token = jwt.sign({ id: user._id }, config.SECRET);
      const maxAge = 63072000000;
      let cookieOptions: CookieOptions = {
        httpOnly: true,
        maxAge,
      };
      res.cookie("token", token, cookieOptions).json({
        user: {
          username: user.username,
          avatar: user.avatar,
          role: user.role,
        },
      });
    } catch (err) {
      catchErrorCtrl(err, res);
    }
  },
};

export default oauthCtrl;
