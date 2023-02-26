const nodemailer = require("nodemailer");

const address = process.env.EMAIL_ADDRESS;
const password = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: address,
    pass: password,
  },
});

module.exports = transporter;
