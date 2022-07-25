const offerRouter = require("express").Router();
const OfferController = require("../controllers/offer.controller");
const isAuth = require("../middlewares/isAuth");
const { body, param } = require("express-validator");

offerRouter.post(
  "/:id",
  [
    param("id").isNumeric().withMessage("Product id must be a number"),
    body("price_offer")
      .notEmpty()
      .withMessage("Price is required")
      .isNumeric()
      .withMessage("Price must be a number"),
  ],
  isAuth,
  OfferController.offeringProduct
);
offerRouter.get(
  "/is-offering/:id",
  isAuth,
  [param("id").isNumeric().withMessage("Product id must be a number")],
  OfferController.isOffering
);

offerRouter.get(
  "/:id",
  isAuth,
  [param("id").isNumeric().withMessage("Product id must be a number")],
  OfferController.detailOffering
);

offerRouter.post(
  "/:id/:status",
  isAuth,
  [
    param("id").isNumeric().withMessage("Product id must be a number"),
    param("status")
      .isIn(["accepted", "rejected", "success", "cancelled"])
      .withMessage("Status must be accepted, rejected, success or cancelled"),
  ],
  OfferController.updateOfferStatus
);

module.exports = offerRouter;
