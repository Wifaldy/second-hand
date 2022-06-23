const userRouter = require("./user.route");
const productRouter = require("./product.route");
const offerRouter = require("./offer.route");
const additionalRouter = require("./additional.routes");

const router = require("express").Router();

router.use(userRouter);
router.use(productRouter);
router.use(offerRouter);
router.use(additionalRouter);

module.exports = router;