const { wishlist, user, product } = require("../models");
const { validationResult } = require("express-validator");

class WishlistController {
  static async addToWishlist(req, res, next) {
    try {
      const { id } = req.params;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw {
          status: 400,
          message: errors.array()[0].msg,
        };
      }
      const findProduct = await product.findByPk(id);
      if (!findProduct) {
        throw {
          status: 404,
          message: "Product not found",
        };
      }
      const findWishlist = await wishlist.findOne({
        where: {
          user_id: req.user.id,
          product_id: id,
        },
      });
      if (findWishlist) {
        throw {
          status: 400,
          message: "Product already in wishlist",
        };
      }
      await wishlist.create({
        user_id: req.user.id,
        product_id: id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      res.status(201).json({
        message: "Success add to wishlist",
      });
    } catch (err) {
      next(err);
    }
  }

  static async getWishlist(req, res, next) {
    try {
      const wishlistByUser = await wishlist.findAll({
        include: {
          model: product,
        },
        where: {
          user_id: req.user.id,
        },
      });
      res.status(200).json({
        message: "Wishlist by user",
        data: wishlistByUser,
      });
    } catch (err) {
      next(err);
    }
  }
  static async deleteWishlist(req, res, next) {
    try {
      const { id } = req.params;
      const findWishlist = await wishlist.findByPk(id);
      if (!findWishlist) {
        throw {
          status: 404,
          message: "Wishlist not found",
        };
      }
      if (findWishlist.user_id !== req.user.id) {
        throw {
          status: 401,
          message: "Unauthorized",
        };
      }
      await findWishlist.destroy();
      res.status(200).json({
        message: "Success delete wishlist",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = WishlistController;
