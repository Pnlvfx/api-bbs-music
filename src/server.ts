import express from 'express';
import cookieParser from 'cookie-parser';
import { connect } from 'mongoose';
import config from './config/config';
import oauthRouter from './components/oauth/oauthRouter';
import musicRouter from './components/music/musicRouter';
import userRouter from './components/user/userRouter';
import auth from './middleware/auth';
import coraline from './coraline/coraline';
import videoRouter from './components/video/videoRouter';
import searchRouter from './components/search/searchRouter';
import artistRouter from './components/artist/artistRouter';
import spotifyToken from './lib/spotifyapis/spotifyToken';
import analyticsRouter from './components/analytics/analyticsRouter';

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json({limit: '50mb'}));

spotifyToken();

const path = coraline.use('music');
const imagesPath = coraline.use('images');

connect(config.MONGO_URI).then(() => {
    console.log("Successfully connected to bbs-music database!")
}).catch(error => new Error(`Cannot connect to bbs-music database: ${error}`));

app.get('/', (req, res) => {
    res.send('http server')
})

app.use('/images/icons', express.static(`${imagesPath}/icons`, {
    cacheControl: true,
    maxAge: "private, max-age=1309600"
}));

app.use('/video', videoRouter);

app.use('/', oauthRouter);

app.use('/user', userRouter);

app.use('/analytics', analyticsRouter);

app.use(auth);

app.use('/search', searchRouter);

app.use('/artist', artistRouter);

app.use('/music', musicRouter);

app.use('/music', express.static(path));

app.listen(4000);