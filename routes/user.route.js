const userRouter = require("express").Router();
const UserController = require("../controllers/user.controller");

userRouter.post("/sign-up", UserController.registerUser);

userRouter.post("/login", UserController.postLogin);

module.exports = userRouter;