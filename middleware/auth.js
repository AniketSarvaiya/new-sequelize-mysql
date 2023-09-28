const jwt = require("jsonwebtoken");
require("dotenv").config();
const { JWT_SECRET } = process.env;

module.exports = async (req, res, next) => {
  //get the token from the headers
  const token = req.header("x-auth-token");
  //check if token
  if (!token) {
    return res
      .status(401)
      .json({ message: `No token ,Oops Authorization is denied !` });
  }
  try {
    console.log("/////////////////", token);
    const decode = await jwt.verify(token, JWT_SECRET, { expiresIn: "20h" });
    console.log(decode);
    if (decode.user === "student")
      return res.status(401).json({ message: "Authorization is denied !" });
    req.userid = decode.id;
    req.email = decode.email;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
