const Joi = require("joi");
const { models } = require("../sequelize");
require("dotenv").config();
const getToken = require("../utils/getToken");
const jwt = require("jsonwebtoken");
const emailVerification = require("../middleware/emailVerification");
const fs = require("fs");
const { BASE_URL, PORT, JWT_SECRET } = process.env;

const userValidation = Joi.object({
  studentId: Joi.required(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6).max(20),
});

const register = async (req, res) => {
  try {
    req.body.studentId = await parseInt(req.body.studentId);
    // console.log(req.body);
    const { error } = userValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) return res.json({ status: "fail", message: error.message });

    const { studentId, firstname, lastname, email, password } = req.body;

    const user = await models.Student.findOne({
      where: { email: email },
    });
    console.log(user?.dataValues.isverified);
    if (user) {
      debugger;
      if (user?.dataValues?.isverified == false) {
        console.log(user.dataValues);
        const token = await getToken({
          id: user.dataValues.id,
          email: user.dataValues.email,
          user: "student",
        });
        const text = `please Verify your email`;
        const url = `${BASE_URL}/api/user/verify/${token}`;
        const html = `<div ><button style="backgroung : green;"> <a href="${url}" style="text-decoration:none; font-weight:bold">Verify Email</a>
              <button></div>`;
        await emailVerification(email, text, html);
        return res.status(400).json({
          status: "fail",
          message: "user is already exist, Verify your email And Login",
        });
      } else {
        return res.status(400).json({
          status: "fail",
          message: "user is already exist, please Login",
        });
      }
    }

    console.log(firstname, lastname, email, password);

    // password = await bcrypt.hash(password, bcrypt.genSalt(10));

    console.log(password);

    const { dataValues } = await models.Student.create({
      studentId,
      firstname,
      lastname,
      email,
      password,
    });
    console.log(dataValues);
    dataValues.password = undefined;

    const token = await getToken({
      id: dataValues.id,
      email: dataValues.email,
      user: "student",
    });
    const text = `please Verify your email`;
    const url = `${BASE_URL}/api/user/verify/${token}`;
    const html = `<div ><button style="backgroung : green;"> <a href="${url}" style="text-decoration:none; font-weight:bold">Verify Email</a>
          <button></div>`;
    await emailVerification(email, text, html);

    res.status(200).json({
      status: "success",
      message: "User Registered Successfully",
      emailVerify: `Verification email sended to : ${email}`,
      user: dataValues,
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error...",
      error: error.message,
    });
  }
};

const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6).max(20),
});
const login = async (req, res) => {
  try {
    const { error } = loginValidation.validate(req.body, { abortEarly: false });
    if (error)
      return res.status(400).json({ status: "fail", message: error.details });

    const { email, password } = req.body;
    const data = await models.Student.findOne({ where: { email: email } });
    const user = data;
    console.log(user);

    if (!user)
      return res
        .status(400)
        .json({ status: "fail", message: "User not exist please Register" });

    // const verifypassword = await bcrypt.compare(password, user.password);

    console.log("------------", password === user.password);
    // if (!verifypassword)
    if (password !== user.password)
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid usernaem or password" });

    const token = await getToken({
      id: user.id,
      email: user.email,
      user: "student",
    });
    console.log(token);

    user.password = undefined;

    if (user.isverified === false) {
      const text = `please Verify your email`;
      const url = `${BASE_URL}/api/user/verify/${token}`;
      const html = `<div ><button style="backgroung : green;"> <a href="${url}" style="text-decoration:none; font-weight:bold">Verify Email</a>
          <button></div>`;
      await emailVerification(user.email, text, html);
      return res.status(200).json("Please verify your email and login");
    } else {
      return res.status(200).json({
        status: "success",
        message: "Login success",
        user: user,
        token: token,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ status: "fail", message: `Internal server error => ${error}` });
  }
};

const getAll = async (req, res) => {
  console.log(req.body);
  try {
    console.log(req.body);
    const user = await models.Student.findOne({ where: { id: req.userid } });
    user.password = undefined;
    res.status(200).json({ message: "success", user: user });
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Internal server error" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const token = req.params.token;
    const { id, email } = await jwt.verify(token, JWT_SECRET);

    const user = await models.Student.update(
      { isverified: true },
      {
        where: {
          id: id,
        },
      }
    );
    return res.send(
      '<h1>Verification Success : <a href="http://localhost:3000/login">Login</a></h1>'
    );
  } catch (error) {}
};

const updatProfilePic = async (req, res) => {
  try {
    const file = req.file;
    console.log(req.body);
    console.log(req.file);
    const { id } = req.body;
    const profilepicurl = `${BASE_URL}/images/profile/${file.filename}`;

    const user = await models.Student.findOne({ where: { id: id } });
    // const image = JSON.stringify(user.profilepic);
    const image = user.profilepic;

    let url = image.split("/");
    const fname = url.pop();

    const updatedusr = await models.Student.update(
      { profilepic: profilepicurl },
      { where: { id: id } }
    );

    if (!updatedusr)
      return res
        .status(400)
        .json({ message: "profile updation failed try again later" });

    const rm = fs.unlinkSync("public/images/profile/" + fname);
    console.log(rm);

    const updateduser = await models.Student.findOne({ where: { id: id } });
    updateduser.password = undefined;
    console.log(updateduser, profilepicurl);
    res.status(200).json({
      status: "success",
      message: "Image updated success",
      user: updateduser,
    });
  } catch (error) {
    res.status(400).json({ error: `error in ->${error}` });
  }
};

module.exports = {
  register,
  login,
  getAll,
  verifyEmail,
  updatProfilePic,
};
