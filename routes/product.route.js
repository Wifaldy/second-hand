const productRouter = require("express").Router();
const ProductController = require("../controllers/product.controller");
const isAuth = require("../middlewares/isAuth");

productRouter.get("/product/:id", ProductController.detailProduct);

productRouter.post("/offering/:id", isAuth, ProductController.offeringProduct);

productRouter.get("/is-offering/:id", isAuth, ProductController.isOffering);

module.exports = productRouter;