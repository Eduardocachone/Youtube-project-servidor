import { Router, request, response } from "express";
import { UserRepository } from "../modules/user/repository/UserRpository";
import { login } from "../middleware/login";

const userRouter = Router()
const userRepository = new UserRepository();



userRouter.post('/sign-up', (request , response) => {
    userRepository.create(request,response)
})


userRouter.post('/sign-in', (request , response) => {
    userRepository.login(request,response)
}) 

userRouter.get('/get-user',login,(request,response)=>{
    userRepository.getUser(request,response);
})

export {userRouter};
