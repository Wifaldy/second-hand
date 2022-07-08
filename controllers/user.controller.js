const { user } = require("../models");
const { validationResult } = require("express-validator");
require("dotenv").config();
const uploadToCloudinary = require("../services/cloudinary.service");

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
          status: 404,
          message: "Data user not found",
        };
      }
      // res.status(200).jsonn(dataUser)
      res.status(200).json({ data: dataUser });
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
      const { name, city_id, address, no_hp } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw {
          status: 400,
          message: errors.array()[0].msg,
        };
      }
      const filePath = await uploadToCloudinary(req.file, "user");
      console.log(filePath);
      await user.update(
        {
          name,
          city_id,
          address,
          no_hp,
          profile_pict: filePath,
        },
        {
          where: {
            id: req.user.id,
          },
        }
      );

      res.status(200).json({
        message: "Successfully update Users",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;
