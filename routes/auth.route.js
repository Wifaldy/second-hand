const authRouter = require("express").Router();
const AuthController = require("../controllers/auth.controller");
const { body } = require("express-validator");

authRouter.post(
  "/sign-up",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please fill a valid email")
      .notEmpty()
      .withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  AuthController.registerUser
);

authRouter.post(
  "/login",
  [
    body("email").notEmpty().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  AuthController.postLogin
);

module.exports = authRouter;
