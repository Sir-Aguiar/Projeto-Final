const multer = require("multer");
const { resolve } = require("path");

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, resolve("src/profile_images"));
  },
  filename(req, file, callback) {
    const time = new Date().getTime();
    callback(null, `${time}_${file.originalname}`);
  },
});

module.exports = { storage };
