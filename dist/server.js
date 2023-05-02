"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const user_routes_1 = require("./routes/user.routes");
const video_routes_1 = require("./routes/video.routes");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const cors = require('cors');
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"),
        res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept"),
        res.header('Access-Control-Allow-Methods', 'POST,GET,PATCH,DELETE,OPTIONS');
    next();
});
app.use(cors());
console.log(process.env.SECRET);
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use('/user', user_routes_1.userRouter);
app.use('/video', video_routes_1.videosRouter);
app.listen(4000);
