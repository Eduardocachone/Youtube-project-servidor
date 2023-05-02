"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const UserRpository_1 = require("../modules/user/repository/UserRpository");
const login_1 = require("../middleware/login");
const userRouter = (0, express_1.Router)();
exports.userRouter = userRouter;
const userRepository = new UserRpository_1.UserRepository();
userRouter.post('/sign-up', (request, response) => {
    userRepository.create(request, response);
});
userRouter.post('/sign-in', (request, response) => {
    userRepository.login(request, response);
});
userRouter.get('/get-user', login_1.login, (request, response) => {
    userRepository.getUser(request, response);
});
