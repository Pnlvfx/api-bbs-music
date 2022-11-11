import { Document, Types } from "mongoose"

export interface IUser extends Document {
    email: string
    username: string
    password: string
    role: number
    avatar: string
    liked_songs: [Types.ObjectId]
    country: string
    countryCode: string
    city: string
    region: string
    lat: string
    lon: string
}