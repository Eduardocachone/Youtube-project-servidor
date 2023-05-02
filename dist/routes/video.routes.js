"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRouter = void 0;
const express_1 = require("express");
const VideosRepository_1 = require("../modules/videos/repositoeis/VideosRepository");
const login_1 = require("../middleware/login");
const videosRouter = (0, express_1.Router)();
exports.videosRouter = videosRouter;
const videoRepository = new VideosRepository_1.VideoRepository();
videosRouter.post('/create-videos', login_1.login, (request, response) => {
    videoRepository.create(request, response);
});
videosRouter.get('/get-videos', (request, response) => {
    videoRepository.getVideos(request, response);
});
videosRouter.get('/search', (request, response) => {
    videoRepository.serachVideos(request, response);
});
