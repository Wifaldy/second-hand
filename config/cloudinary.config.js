const cloudinaryProvider = require("cloudinary").v2;

cloudinaryProvider.config({
  cloud_name: process.env.CNR_CLOUD_NAME,
  api_key: process.env.CNR_API_KEY,
  api_secret: process.env.CNR_API_SECRET,
  secure: true,
});

module.exports = cloudinaryProvider;
