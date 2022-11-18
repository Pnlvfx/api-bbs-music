import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path: path.resolve(__dirname, '../../config.env')})

interface ENV {
   MONGO_URI: string | undefined
   SECRET: string | undefined
   GOOGLE_SECRET: string | undefined
   NODE_ENV: string | undefined
   SERVER_URL: string | undefined
   LASTFM_API_KEY: string | undefined
   LASTFM_API_SECRET: string | undefined
   IP_LOOKUP_API_KEY: string | undefined
   COOKIE_DOMAIN: string | undefined
}

interface Config {
    MONGO_URI: string
    SECRET: string
    GOOGLE_SECRET: string
    NODE_ENV: 'development' | 'production'
    SERVER_URL: string
    LASTFM_API_KEY: string
    LASTFM_API_SECRET: string
    IP_LOOKUP_API_KEY: string
    COOKIE_DOMAIN: string
}

const getConfig = (): ENV => {
    return {
        MONGO_URI: process.env.MONGO_URI,
        SECRET: process.env.SECRET,
        GOOGLE_SECRET: process.env.GOOGLE_SECRET,
        NODE_ENV: process.env.NODE_ENV,
        SERVER_URL: process.env.SERVER_URL,
        LASTFM_API_KEY: process.env.LASTFM_API_KEY,
        LASTFM_API_SECRET: process.env.LASTFM_API_SECRET,
        IP_LOOKUP_API_KEY: process.env.IP_LOOKUP_API_KEY,
        COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
    }
}

const getSanitzedConfig = (config: ENV): Config => {
    for (const [key,value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error(`Missing key ${key}`)
        }
    }
    return config as Config;
}
const config = getConfig()

const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;