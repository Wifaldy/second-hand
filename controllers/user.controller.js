const { user } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const fs = require("fs");
require("dotenv").config();

class UserController {
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
      if (!name || !email || !password) {
        throw {
          status: 400,
          message: "Name, Email, or Password should not be empty",
        };
      }
      const user = await user.findOne({
        where: {
          email,
        },
      });
      if (user) {
        throw {
          status: 400,
          message: "Invalid Email",
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

  static async update(req, res, next) {
    try {
      const dataUser = await user.findOne({
        where: {
          id: req.user.id,
        },
      });

      if (req.file) {
        req.body.profile_pict = `http://localhost:3000/user/${req.file.filename}`;
      }

      const { name, city, address, no_hp } = req.body;
      const errors = validationResult(req.body);
      if (!errors.isEmpty()) {
        throw {
          status: 400,
          message: errors.array()[0].msg,
        };
      }

      await user.update(
        {
          name,
          city,
          address,
          no_hp,
          profile_pict: req.body.profile_pict,
        },
        {
          where: {
            id: req.user.id,
          },
        }
      );

      // Delete File
      const DIR =
        "public/user/" +
        dataUser.profile_pict.split("http://localhost:3000/user/")[1];
      if (fs.existsSync(DIR)) {
        fs.unlinkSync(DIR);
      }

      res.status(200).json({
        message: "Successfully update Users",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;
