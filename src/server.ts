import http2Express from "http2-express-bridge";
import http2 from 'http2';
import express from 'express';
import fs from 'fs';
import musicRouter from "./components/musicRouter";
import cookieParser from 'cookie-parser';

const options = {
    key: fs.readFileSync('./cert/192.168.1.21-key.pem'),
    cert: fs.readFileSync('./cert/192.168.1.21.pem'),
}

const app = http2Express(express);

app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json({limit: '50mb'}));


app.get('/', (req, res) => {
    res.send('http2 server')
})

app.use('/music', musicRouter);

http2.createSecureServer(options, app).listen(4000);