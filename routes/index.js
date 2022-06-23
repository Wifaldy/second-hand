const userRouter = require("./user.route");
const productRouter = require("./product.route");
const offerRouter = require("./offer.route");

const router = require("express").Router();

router.use("/user", userRouter);
router.use("/product", productRouter);
router.use("/offer", offerRouter);

module.exports = router;
