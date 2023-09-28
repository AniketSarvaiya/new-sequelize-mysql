const express = require("express");
const routes = express.Router();
const userController = require("../controller/userControllers");
const auth = require("../middleware/auth");
const { imageUploads } = require("../middleware/multerUpload");

routes.post("/register", userController.register);
routes.post("/login", userController.login);
routes.get("/getall", auth, userController.getAll);
routes.get("/verify/:token", userController.verifyEmail);
routes.post(
  "/update/profilepic",
  imageUploads("./public/images/profile").single("profilepic"),
  userController.updatProfilePic
);

module.exports = routes;
