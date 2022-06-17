const productRouter = require("express").Router();
const ProductController = require("../controllers/product.controller");
const isAuth = require("../middlewares/isAuth");
const { body } = require("express-validator");
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

productRouter.post(
    "/offering/:id", [body("price_offer").notEmpty().withMessage("Price is required")],
    isAuth,
    ProductController.offeringProduct
);

productRouter.get("/is-offering/:id", isAuth, ProductController.isOffering);

productRouter.get("/product-by-user", isAuth, ProductController.productByUser);

productRouter.post(
    "/product",
    upload.array("product_pict"),
    isAuth, [
        body("name").notEmpty().withMessage("Product name is required"),
        body("price").notEmpty().withMessage("Price is required"),
        body("description").notEmpty().withMessage("Description is required"),
        body("categories").notEmpty().withMessage("Please fill a valid categories"),
        body("product_pict").custom((value, { req }) => {
            if (req.files.length > 4) {
                throw new Error("Exceeded maximum pictures allowed");
            } else if (!req.files) {
                throw new Error("Please upload a picture");
            }
            return true;
        }),
    ],
    ProductController.createProduct
); // update terbitkan

// productRouter.post(
//   "/product-preview",
//   upload.array("product_pict"),
//   isAuth,
//   ProductController.previewProduct
// );

// productRouter.get("/re-edit", isAuth, ProductController.reEditProduct);

module.exports = productRouter;