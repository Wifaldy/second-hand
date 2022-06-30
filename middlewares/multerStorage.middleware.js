const multer = require("multer");
const fs = require("fs");

const storageUser = multer.diskStorage({
  destination: function (req, file, cb) {
    if (fs.existsSync("public/users/")) {
      cb(null, "public/users");
    } else {
      fs.mkdirSync("public/users", { recursive: true });
      cb(null, "public/users");
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
    if (fs.existsSync("public/products/")) {
      cb(null, "public/products");
    } else {
      fs.mkdirSync("public/products", { recursive: true });
      cb(null, "public/products");
    }
  },
  filename: function (req, file, cb) {
    file.originalname = file.originalname.replaceAll(" ", "-");
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

module.exports = { storageUser, storageProduct };
