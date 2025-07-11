import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Use your real Gmail credentials here
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,       
    pass: process.env.EMAIL_PASS,           
  },
});

