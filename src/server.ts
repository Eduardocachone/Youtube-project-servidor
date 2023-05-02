import express from "express";
import bodyParser from 'body-parser'; 
import { userRouter } from "./routes/user.routes";
import { videosRouter } from "./routes/video.routes";
import { config } from "dotenv";

config();
const app = express(); 

const cors = require('cors');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"),
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept"),
    res.header('Access-Control-Allow-Methods','POST,GET,PATCH,DELETE,OPTIONS');
    next();
});

app.use(cors());

console.log(process.env.SECRET)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/user', userRouter);
app.use('/video', videosRouter);

app.listen(4000);
