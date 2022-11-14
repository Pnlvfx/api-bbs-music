import jwt, { JwtPayload } from 'jsonwebtoken';
import { catchError } from '../../lib/common';
import User from '../../models/User';
import config from '../../config/config';

export const getUserFromToken = async (token: string) => {
    try {
        const verify = jwt.verify(token, config.SECRET) as JwtPayload;
        const user = await User.findById(verify.id);
        if (!user) throw new Error('Something went wrong');
        return user;
    } catch (err) {
        throw catchError(err);
    }
}