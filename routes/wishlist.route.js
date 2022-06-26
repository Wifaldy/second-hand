const wishlistRouter = require("express").Router();
const WishlistController = require("../controllers/wishlist.controller");
const isAuth = require("../middlewares/isAuth");
const { param } = require("express-validator");

wishlistRouter.get("/", isAuth, WishlistController.getWishlist);

wishlistRouter.post(
  "/:id",
  isAuth,
  [param("id").isInt().withMessage("Product id must be an integer")],
  WishlistController.addToWishlist
);

module.exports = wishlistRouter;
