import { Router } from "express";
import { VideoRepository } from "../modules/videos/repositoeis/VideosRepository";
import { login } from "../middleware/login";


const videosRouter = Router()
const videoRepository = new VideoRepository()

videosRouter.post('/create-videos',login, (request , response) => {
    videoRepository.create(request, response);
})

videosRouter.get('/get-videos', (request , response) => {
    videoRepository.getVideos(request, response);
})

videosRouter.get('/search', (request , response) => {
    videoRepository.serachVideos(request, response);
})

export { videosRouter };

