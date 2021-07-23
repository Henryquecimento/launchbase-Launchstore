const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "b8b2095dae39d3",
    pass: "91bebfc688b6a2"
  }
});