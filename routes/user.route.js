const userRouter = require("express").Router();
const UserController = require("../controllers/user.controller");
const { body } = require("express-validator");

userRouter.post("/sign-up", UserController.registerUser);

userRouter.post(
    "/login", [
        body("email").notEmpty().withMessage("Email is required"),
        body("password").notEmpty().withMessage("Password is required"),
    ],
    UserController.postLogin
);

module.exports = userRouter;