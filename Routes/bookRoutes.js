const express = require("express");
const bookController = require("../controller/bookController");
const routes = express.Router();
const { imageUploads } = require("../middleware/multerUpload");

routes.post(
  "/add",
  imageUploads("./public/images/book").single("bookimage"),
  bookController.addbook
);
routes.post("/borrow", bookController.borrowBook);
routes.get("/getborrowed", bookController.BorrowBookDetails);

module.exports = routes;
