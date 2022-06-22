const userRouter = require("./user.route");
const productRouter = require("./product.route");
const offerRouter = require("./offer.route");

const router = require("express").Router();

router.use(userRouter);
router.use(productRouter);
router.use(offerRouter);

module.exports = router;