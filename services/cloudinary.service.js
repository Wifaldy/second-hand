const cloudinaryProvider = require("../config/cloudinary.config");
const fs = require("fs");
const directoryList = ["user", "product"];


/**
 * Returns path dari cloudinary.
 * Semua param wajib diisi.
 * @param {object | array} fileData Input req.file atau req.files.
 * @param {string} directoryType Folder dari file, product atau user.
 * @return {string | array} Path dari cloudinary.
 */
async function uploadToCloudinary(fileData, directoryType) {

  if (!directoryList.includes(directoryType) || !directoryType)
    throw new Error(
      "Please enter correct directory type. Available type: user, product"
    );

  if (Array.isArray(fileData)) {
    const result = [];
    for (const file of fileData) {
      const uploadedFile = await cloudinaryProvider.uploader.upload(file.path, {
        folder: directoryType,
      });
      result.push(uploadedFile.secure_url);
      fs.unlinkSync(file.path);
    }
    return result; // array with cloud files
  }
  const result = await cloudinaryProvider.uploader.upload(fileData.path, {
    folder: directoryType,
  });
  fs.unlinkSync(fileData.path);
  return result.secure_url; // cloud file
}

const deletePict = async (imgUrl) => {
  try {
    const splitURL = imgUrl.split('/')
    const imageId = splitURL[splitURL.length - 1].slice(0, splitURL[splitURL.length - 1].length - 4)
    await cloudinaryProvider.uploader.destroy(imageId, (err, res) => {
      console.log(err);
    }) 
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {uploadToCloudinary, deletePict};
