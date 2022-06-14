const UserController = require('../controllers/user.controller');

const userRouter = require('express').Router();

userRouter.post('/sign-up', UserController.registerUser);



module.exports = userRouter;