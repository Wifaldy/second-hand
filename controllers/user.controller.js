const { user } = require("../models");
const { validationResult } = require("express-validator");
const fs = require("fs");
require("dotenv").config();

class UserController {
  static async detailUser(req, res, next) {
    try {
      const dataUser = await user.findOne({
        attributes: { exclude: ["password"] },
        where: {
          id: req.user.id,
        },
      });
      if (!dataUser) {
        throw {
          status: 401,
          message: "Unauthorized request",
        };
      } else {
        // res.status(200).jsonn(dataUser)
        res.status(200).json(dataUser);
      }
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req, res, next) {
    try {
      const dataUser = await user.findOne({
        where: {
          id: req.user.id,
        },
      });
      if (!dataUser) {
        throw {
          status: 404,
          message: "User not found",
        };
      }
      if (req.file) {
        req.body.profile_pict = `${process.env.BASE_URL}user/${req.file.filename}`;
      }
      const { name, city_id, address, no_hp } = req.body;
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
          city_id,
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
      if (req.file) {
        // Delete File
        const DIR =
          "public/user/" +
          dataUser.profile_pict.split(`${process.env.BASE_URL}user/`)[1];
        if (fs.existsSync(DIR)) {
          fs.unlinkSync(DIR);
        }
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
