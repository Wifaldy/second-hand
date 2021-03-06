const userRouter = require("express").Router();
const UserController = require("../controllers/user.controller");
const { body } = require("express-validator");
const isAuth = require("../middlewares/isAuth");
const multer = require("multer");
const { storageUser } = require("../middlewares/multerStorage.middleware");
const upload = multer({
  storage: storageUser,
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

// detail user
userRouter.get("/", isAuth, UserController.detailUser);

// update data user
userRouter.put(
  "/update",
  isAuth,
  upload.single("profile_pict"),
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city_id").notEmpty().withMessage("City is required"),
    body("address").notEmpty().withMessage("address is required"),
    body("no_hp")
      .notEmpty()
      .withMessage("No Handphone is required")
      .isNumeric()
      .withMessage("No Handphone must be number"),
    body("profile_pict").custom((value, { req }) => {
      if (!req.file) {
        throw new Error("Profile pict is required");
      }
      return true;
    }),
  ],
  UserController.updateUser
);

module.exports = userRouter;
