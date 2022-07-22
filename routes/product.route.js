const productRouter = require("express").Router();
const ProductController = require("../controllers/product.controller");
const isAuth = require("../middlewares/isAuth");
const ifAuth = require("../middlewares/ifAuth");
const { body, param } = require("express-validator");
const multer = require("multer");
const { storageProduct } = require("../middlewares/multerStorage.middleware");
const upload = multer({
  storage: storageProduct,
  fileFilter: (req, file, cb) => {
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
productRouter.get("/", ifAuth, ProductController.listProduct);

productRouter.get("/histories", isAuth, ProductController.getSoldProducts);

productRouter.get("/user", isAuth, ProductController.productByUser);

productRouter.get("/offered", isAuth, ProductController.getOfferedProducts);

productRouter.get("/re-edit", isAuth, ProductController.reEditProduct);

productRouter.get("/preview", isAuth, ProductController.getPreviewProduct);

productRouter.post(
  "/",
  upload.array("product_pict"),
  isAuth,
  [
    body("name").notEmpty().withMessage("Product name is required"),
    body("price")
      .notEmpty()
      .withMessage("Price is required")
      .isNumeric()
      .withMessage("Price must be a number"),
    body("description").notEmpty().withMessage("Description is required"),
    body("categories").custom((value, { req }) => {
      if (value.length > 5) {
        throw new Error("Exceeded maximum categories allowed");
      } else if (value.length < 1) {
        throw new Error("Please upload a picture");
      }
      return true;
    }),
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
    param("id").isNumeric().withMessage("Product id must be a number"),
    body("name").notEmpty().withMessage("Product name is required"),
    body("price")
      .notEmpty()
      .withMessage("Price is required")
      .isNumeric()
      .withMessage("Price must be a number"),
    body("description").notEmpty().withMessage("Description is required"),
    body("categories").custom((value, { req }) => {
      if (value.length > 5) {
        throw new Error("Exceeded maximum categories allowed");
      } else if (value.length < 1) {
        throw new Error("Please upload a picture");
      }
      return true;
    }),
    body("product_pict").custom((value, { req }) => {
      if (req.files.length > 4) {
        throw new Error("Exceeded maximum pictures allowed");
      } else if (req.files.length < 1) {
        throw new Error("Please upload a picture");
      }
      return true;
    }),
  ],
  ProductController.updateProduct
);

productRouter.get(
  "/:id",
  [param("id").isNumeric().withMessage("Product id must be a number")],
  ProductController.detailProduct
);

productRouter.delete(
  "/:id",
  isAuth,
  [param("id").isNumeric().withMessage("Product id must be a number")],
  ProductController.deleteProduct
);

productRouter.post(
  "/preview",
  upload.array("product_pict"),
  isAuth,
  [
    body("name").notEmpty().withMessage("Product name is required"),
    body("price")
      .notEmpty()
      .withMessage("Price is required")
      .isNumeric()
      .withMessage("Price must be a number"),
    body("description").notEmpty().withMessage("Description is required"),
    body("categories").custom((value, { req }) => {
      if (value.length > 5) {
        throw new Error("Exceeded maximum categories allowed");
      } else if (value.length < 1) {
        throw new Error("Please upload a picture");
      }
      return true;
    }),
    body("product_pict").custom((value, { req }) => {
      if (req.files.length > 4) {
        throw new Error("Exceeded maximum pictures allowed");
      } else if (req.files.length < 1) {
        throw new Error("Please upload a picture");
      }
      return true;
    }),
  ],
  ProductController.postPreviewProduct
);

module.exports = productRouter;
