const multer = require('multer');
const fs = require('fs')

const storageUser = multer.diskStorage({
  destination: function (req, file, cb) {
    if (fs.existsSync('public/user/')) {
      cb(null, 'public/user')
    } else {
      fs.mkdirSync('public/user', {recursive: true})
      cb(null, 'public/user')
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

module.exports = { storageUser }