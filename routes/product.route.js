const productRouter = require("express").Router();
const ProductController = require("../controllers/product.controller");
const isAuth = require("../middlewares/isAuth");
const { body, param } = require("express-validator");
const multer = require("multer");
const { storageProduct } = require("../middlewares/multerStorage.middleware");
const upload = multer({
  storage: storageProduct,
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

// Get All Data & Search Product
productRouter.get("/", ProductController.listProduct);

productRouter.get("/histories", isAuth, ProductController.getSoldProducts);

productRouter.get("/user", isAuth, ProductController.productByUser);

productRouter.get("/offered", isAuth, ProductController.getOfferedProducts);

productRouter.post(
  "/",
  upload.array("product_pict"),
  isAuth,
  [
    body("name").notEmpty().withMessage("Product name is required"),
    body("price")
      .notEmpty()
      .withMessage("Price is required")
      .isInt()
      .withMessage("Price must be an integer"),
    body("description").notEmpty().withMessage("Description is required"),
    body("categories").notEmpty().withMessage("Please fill a valid categories"),
    body("product_pict").custom((value, { req }) => {
      if (req.files.length > 4) {
        throw new Error("Exceeded maximum pictures allowed");
      } else if (req.files.length < 1) {
        throw new Error("Please upload a picture");
      }
      return true;
    }),
  ],
  ProductController.createProduct
); // update terbitkan

productRouter.put(
  "/:id",
  upload.array("product_pict"),
  isAuth,
  [
    param("id").isInt().withMessage("Product id must be an integer"),
    body("name").notEmpty().withMessage("Product name is required"),
    body("price")
      .notEmpty()
      .withMessage("Price is required")
      .isInt()
      .withMessage("Price must be an integer"),
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
  ProductController.updateProduct
);

productRouter.get(
  "/:id",
  [param("id").isInt().withMessage("Product id must be an integer")],
  ProductController.detailProduct
);

productRouter.delete(
  "/:id",
  isAuth,
  [param("id").isInt().withMessage("Product id must be an integer")],
  ProductController.deleteProduct
);

// productRouter.post(
//   "/product-preview",
//   upload.array("product_pict"),
//   isAuth,
//   ProductController.previewProduct
// );

// productRouter.get("/re-edit", isAuth, ProductController.reEditProduct);

module.exports = productRouter;
