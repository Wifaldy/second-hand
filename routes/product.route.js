const productRouter = require("express").Router();
const ProductController = require("../controllers/product.controller");
const isAuth = require("../middlewares/isAuth");
const multer = require("multer");
const { storageUser } = require("../middlewares/multerStorage.middleware");
const upload = multer({
    storage: storageUser,
    fileFilter: (req, file, cb) => {
        console.log(file.mimetype);
        if (
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/png"
        ) {
            cb(null, true);
        } else {
            cb(new Error("File should be an image"), false);
        }
    },
});

productRouter.get("/product/:id", ProductController.detailProduct);

productRouter.post("/offering/:id", isAuth, ProductController.offeringProduct);

productRouter.get("/is-offering/:id", isAuth, ProductController.isOffering);

productRouter.get("/product-by-user", isAuth, ProductController.productByUser);

productRouter.put(
    "/product/:id",
    upload.array("product_pict"),
    isAuth,
    ProductController.updateProduct
); // update terbitkan

productRouter.post(
    "/product-preview",
    upload.array("product_pict"),
    isAuth,
    ProductController.previewProduct
);

productRouter.get("/re-edit", isAuth, ProductController.reEditProduct);

module.exports = productRouter;