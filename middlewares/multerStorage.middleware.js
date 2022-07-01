const multer = require("multer");
const fs = require("fs");

const storageUser = multer.diskStorage({
  destination: function (req, file, cb) {
    if (fs.existsSync("public/users_pict/")) {
      cb(null, "public/users_pict");
    } else {
      fs.mkdirSync("public/users_pict", { recursive: true });
      cb(null, "public/users_pict");
    }
  },
  filename: function (req, file, cb) {
    file.originalname = file.originalname.replaceAll(" ", "-");
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
const storageProduct = multer.diskStorage({
  destination: function (req, file, cb) {
    if (fs.existsSync("public/products_pict/")) {
      cb(null, "public/products_pict");
    } else {
      fs.mkdirSync("public/products_pict", { recursive: true });
      cb(null, "public/products_pict");
    }
  },
  filename: function (req, file, cb) {
    file.originalname = file.originalname.replaceAll(" ", "-");
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

module.exports = { storageUser, storageProduct };
