import { CookieOptions, Request, Response } from "express";
import config from '../../config/config';
import bcrypt from 'bcrypt';
import User from '../../models/User';
import { catchErrorCtrl } from "../../lib/common";
import jwt from 'jsonwebtoken';

const oauthCtrl = {
    logout: async (req: Request, res: Response) => {
        try {
            res.clearCookie('token',{
                httpOnly: true,
            }).send()
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
                lon
            } = req.body;
            let user = await User.findOne({email});
            const password = email + config.GOOGLE_SECRET;
            const passwordHash = bcrypt.hashSync(password, 10);
            if (user) {
                const match = bcrypt.compareSync(password, user.password);
                if (!match) return res.status(400).json({msg: "Password is incorrect!"});
            } else {
                const username = name.replace(/\s/g, '');
                user = new User({
                    username,
                    email,
                    password: passwordHash,
                    country,
                    countryCode,
                    city,
                    region,
                    lat,
                    lon
                });
                await user.save();
            }
            const token = jwt.sign({id: user._id}, config.SECRET);
            const maxAge = 63072000000
            let cookieOptions: CookieOptions = {
                httpOnly: true,
                maxAge,
            }
            res.cookie('token', token, cookieOptions).json({
                user: {
                    username: user.username,
                    avatar: user.avatar,
                    role: user.role
                }
            });
        } catch (err) {
            catchErrorCtrl(err, res);
        }
    }
}

export default oauthCtrl;
