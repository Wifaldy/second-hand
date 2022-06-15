const userRouter = require("./user.route");
const productRouter = require("./product.route");

const router = require("express").Router();

router.use(userRouter);
router.use(productRouter);

module.exports = router;