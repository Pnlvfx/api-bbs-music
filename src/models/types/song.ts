import { Document } from "mongoose"

export interface YDdownload {
    videoId: string
    stats: any
    file: string
    youtubeUrl: string
    videoTitle: string
    artist: string
    title: string
    thumbnail: string
}

export interface SongProps extends Document {
    id: string
    url: string
    type: string
    content_type: string
    duration: number
    title: string
    artist: string
    album?: string
    description?: string
    genre?: string
    date?: string
    artwork: string
    file: string //only server
}