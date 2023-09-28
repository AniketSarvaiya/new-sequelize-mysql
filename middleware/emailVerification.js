//qkfs yqhi gqwh qfld
const nodemailer = require("nodemailer");
require("dotenv").config();
const { NM_HOST, NM_SERVICE, NM_PORT, NM_SECURE, NM_USER, NM_PASSWORD } =
  process.env;

module.exports = async (reciverEmail, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: NM_HOST,
      service: NM_SERVICE,
      port: NM_PORT,
      secure: NM_SECURE,
      auth: {
        user: NM_USER,
        pass: NM_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: NM_USER,
      to: reciverEmail,
      subject: "Email Verification",
      text: text,
      html: html,
    });
    console.log("email sent successfully...");
  } catch (error) {
    console.log(`error in nodemailer : ${error} `);
  }
};
