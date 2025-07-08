import nodemailer from "nodemailer";

// Use your real Gmail credentials here
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yourEmail@gmail.com",       // ✅ your Gmail ID
    pass: "yourAppPassword",           // ✅ app password (not normal password)
  },
});
