const wishlistRouter = require("express").Router();
const WishlistController = require("../controllers/wishlist.controller");
const isAuth = require("../middlewares/isAuth");
const { param } = require("express-validator");

wishlistRouter.get("/", isAuth, WishlistController.getWishlist);

wishlistRouter.post(
  "/:id",
  isAuth,
  [param("id").isNumeric().withMessage("Product id must be a number")],
  WishlistController.addToWishlist
);

wishlistRouter.delete(
  "/:id",
  isAuth,
  [param("id").isNumeric().withMessage("Product id must be a number")],
  WishlistController.deleteWishlist
);

module.exports = wishlistRouter;
