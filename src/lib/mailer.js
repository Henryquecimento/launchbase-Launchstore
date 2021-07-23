const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "50799409a5dd8d",
    pass: "eb10c4daa76c91"
  }
});