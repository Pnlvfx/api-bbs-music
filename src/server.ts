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
import initialRouter from './components/user/initial/initialRouter';
import searchRouter from './components/search/searchRouter';
import artistRouter from './components/artist/artistRouter';
import playerRouter from './components/player/playerRouter';

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json({limit: '50mb'}));

const path = coraline.use('music');
const imagesPath = coraline.use('images');

connect(config.MONGO_URI).then(() => {
    console.log("Successfully connected to bbs-music database!")
}).catch(error => new Error(`Cannot connect to bbs-music database: ${error}`));

app.get('/', (req, res) => {
    res.send('http server')
})

app.use('/images/icons', express.static(`${imagesPath}/icons`));

app.use('/video', videoRouter);

app.use('/', oauthRouter);

app.use('/user', userRouter);

app.use(auth);

app.use('/', initialRouter);

app.use('/search', searchRouter);

app.use('/artist', artistRouter);

app.use('/player', playerRouter);

app.use('/music', musicRouter);

app.use('/music', express.static(path));

app.listen(4000);