import express from 'express';
import cookieParser from 'cookie-parser';
import { connect } from 'mongoose';
import config from './config/config';
import oauthRouter from './components/oauth/oauthRouter';
import musicRouter from './components/music/musicRouter';
import userRouter from './components/user/userRouter';

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json({limit: '50mb'}));

connect(config.MONGO_URI).then(() => {
    console.log("Successfully connected to bbs-music database!")
}).catch(error => new Error(`Cannot connect to bbs-music database: ${error}`));

app.get('/', (req, res) => {
    res.send('http server')
})

app.use('/', oauthRouter);

app.use('/user', userRouter);

app.use('/music', musicRouter);

app.listen(4000);