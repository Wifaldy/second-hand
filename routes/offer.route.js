const offerRouter = require("express").Router();
const OfferController = require("../controllers/offer.controller");
const isAuth = require("../middlewares/isAuth");
const { body, param } = require("express-validator");

offerRouter.post(
  "/:id",
  [
    param("id").isInt().withMessage("Product id must be an integer"),
    body("price_offer")
      .notEmpty()
      .withMessage("Price is required")
      .isInt()
      .withMessage("Price must be an integer"),
  ],
  isAuth,
  OfferController.offeringProduct
);
offerRouter.get(
  "/is-offering/:id",
  isAuth,
  [param("id").isInt().withMessage("Product id must be an integer")],
  OfferController.isOffering
);

offerRouter.get(
  "/:id",
  isAuth,
  [param("id").isInt().withMessage("Product id must be an integer")],
  OfferController.detailOffering
);

offerRouter.post(
  "/:id/:status",
  isAuth,
  [
    param("id").isInt().withMessage("Product id must be an integer"),
    param("status")
      .isIn(["accepted", "rejected", "success", "cancelled"])
      .withMessage("Status must be accepted, rejected, success or cancelled"),
  ],
  OfferController.updateOfferStatus
);

module.exports = offerRouter;
