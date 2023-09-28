const multer = require("multer");
const path = require("path");

const imageUploads = (imagePath) => {
  const storage = multer.diskStorage({
    destination: (req, res, cb) => {
      cb(null, `${imagePath}`);
      //   cb(null, "./public/images");
    },
    filename: (req, file, cb) => {
      console.log(file);
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

  const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      var filetypes = /jpeg|jpg|png/;
      var mimetype = filetypes.test(file.mimetype);
      var extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
      );

      if (mimetype && extname) {
        return cb(null, true);
      }
      cb(
        "Error: File upload only supports the following filetypes - " +
          filetypes
      );
    },
  });
  return upload;
};
module.exports = { imageUploads };
