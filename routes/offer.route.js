const offerRouter = require("express").Router();
const OfferController = require("../controllers/offer.controller");
const isAuth = require("../middlewares/isAuth");
const { body } = require("express-validator");

offerRouter.post(
  "/:id",
  [body("price_offer").notEmpty().withMessage("Price is required")],
  isAuth,
  OfferController.offeringProduct
);

offerRouter.get("/is-offering/:id", isAuth, OfferController.isOffering);

offerRouter.get("/:id", isAuth, OfferController.detailOffering);

module.exports = offerRouter;
