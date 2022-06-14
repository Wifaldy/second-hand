const userRouter = require("express").Router();
const userController = require("../controllers/user.controller");

userRouter.post("/login", userController.postLogin);

module.exports = userRouter;