const { user } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
require("dotenv").config();

class AuthController {
  static async postLogin(req, res, next) {
    try {
      const { email, password } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw {
          status: 400,
          message: errors.array()[0].msg,
        };
      }
      const findUser = await user.findOne({
        where: {
          email: email,
        },
      });
      if (!findUser) {
        throw {
          status: 404,
          message: "User not found",
        };
      }
      const isPasswordMatch = await bcrypt.compare(password, findUser.password);
      if (!isPasswordMatch) {
        throw {
          status: 400,
          message: "Email / Password is incorrect",
        };
      }
      const token = jwt.sign(
        {
          id: findUser.id,
          email: findUser.email,
        },
        process.env.JWT_SECRET
      );
      res.status(200).json({
        message: "Login success",
        token: token,
      });
    } catch (err) {
      next(err);
    }
  }
  static async registerUser(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw {
          status: 400,
          message: errors.array()[0].msg,
        };
      }
      const findUser = await user.findOne({
        where: {
          email,
        },
      });
      if (findUser) {
        throw {
          status: 400,
          message: "Email already exist",
        };
      }
      await user.create({
        name,
        email,
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      res.status(201).json({
        message: "Success add new user",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
