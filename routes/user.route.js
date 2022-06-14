const userRouter = require("express").Router();
const UserController = require("../controllers/user.controller");
const { body } = require("express-validator");

// Auth Sign Up
userRouter.post('/sign-up', UserController.registerUser)

// update data user
userRouter.put('/update', [
  body("name").notEmpty().withMessage("Name is required"),
  body("password").notEmpty().withMessage("Password is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("address").notEmpty().withMessage("address is required"),
  body("no_hp").notEmpty().withMessage("No Handphone is required"),
],
UserController.update)

module.exports = userRouter;