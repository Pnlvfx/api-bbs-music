import {Schema, model} from "mongoose";
import { IUser } from "./types/user";

const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        unique: true,
        required: [true, "Please enter your email!"],
        trim: true,
    },
    username: {
        type:String,
        unique:true,
        required:[true, "can't be blank"],
        trim: true
    },
    password: {
        type:String,
        required:true
    },
    role: {
        type: Number,
        default: 0
    },
    avatar: {
        type: String,
        default: "https://api.bbabystyle.com/images/icons/undi.png"
    },
    liked_tracks: {
        type: [Schema.Types.ObjectId]
    },
    last_search: {
        type: [Schema.Types.ObjectId]
    },
    country: {
        type: String,
    },
    countryCode: {
        type: String,
    },
    city: {
        type: String,
    },
    region: {
        type: String,
    },
    lat: {
        type: String,
    },
    lon: {
        type: String,
    },
}, {
    timestamps: true
});
const User = model('User', UserSchema);

export default User;