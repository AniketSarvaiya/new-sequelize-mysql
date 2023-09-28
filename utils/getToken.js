const jwt = require("jsonwebtoken")
require("dotenv").config();
const { JWT_SECRET } = process.env;


const getToken = async (payload) => {
    try {
        const token = await jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: "24h" })
        // console.log({ token });
        return token;
    } catch (error) {
        return error;
    }
}

module.exports = getToken