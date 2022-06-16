const userRouter = require("express").Router();
const UserController = require("../controllers/user.controller");
const { body } = require("express-validator");
const isAuth = require("../middlewares/isAuth");
const multer = require('multer')
const { storageUser } = require('../middlewares/multerStorage.middleware')
const upload = multer(
  {
    storage: storageUser,
    fileFilter: (req, file, cb) => {
      console.log(file.mimetype)
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true)
      } else {
        cb(new Error('File should be an image'), false)
      }
    }
  }
)

userRouter.post("/sign-up", UserController.registerUser);

userRouter.post(
    "/login", [
        body("email").notEmpty().withMessage("Email is required"),
        body("password").notEmpty().withMessage("Password is required"),
    ],
    UserController.postLogin
);

// detail user
userRouter.get('/detail-user', isAuth, UserController.detail);

// update data user
userRouter.put(
    '/update-user', isAuth,
    upload.single('profile_pict'), 
    [
        body("name").notEmpty().withMessage("Name is required"),
        body("city").notEmpty().withMessage("City is required"),
        body("address").notEmpty().withMessage("address is required"),
        body("no_hp").notEmpty().withMessage("No Handphone is required"),
    ], 
    UserController.update
);

module.exports = userRouter;