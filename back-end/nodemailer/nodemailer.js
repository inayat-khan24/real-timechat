// utils/mailer.js
import nodemailer from "nodemailer"
import dotenv from "dotenv";
dotenv.config();
// process.env.MONGO_URI
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});

export default transporter;


