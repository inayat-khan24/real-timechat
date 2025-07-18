// utils/mailer.js
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "infotech241123@gmail.com",
    pass: "eivlnsbtmpzkolgg", 
  },
});

export default transporter;


