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

productRouter.post("/offering/:id", isAuth, ProductController.offeringProduct);

productRouter.get("/is-offering/:id", isAuth, ProductController.isOffering);

productRouter.get("/product-by-user", isAuth, ProductController.productByUser);

productRouter.post(
  "/product/:id",
  upload.array("product_pict"),
  isAuth,
  [
    body("name").notEmpty().withMessage("Product name is required"),
    body("user_id").notEmpty().withMessage("Please fill a valid user id"),
    body("category_id")
      .notEmpty()
      .withMessage("Please fill a valid category id"),
    body("price").notEmpty().withMessage("Price is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("status").notEmpty().withMessage("Status is required"),
    body("product_pict")
      .notEmpty()
      .withMessage("Product pictures are required")
      .custom((_value) => {
        if (req.files.length > 4) {
          throw new Error("Exceeded maximum pictures allowed");
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
