import bcrypt from "bcryptjs";
import dotenv from 'dotenv'; 
import crypto from "crypto";
dotenv.config();
import jwt from "jsonwebtoken";
import path from "path";
import { User } from "../models/User.js";
import transporter from "../nodemailer/nodemailer.js";


// sing up 
export const singUp =  async (req, res) => {
  const { username,name ,email, password } = req.body;
  console.log({
    username,
    name,
    email,
    password
  })

  if(!username || !name || !email || !password){
    res.status(404).json({
        result : false,
        message : "username , name ,email  and password required"
    })
  }

  const exist = await User.findOne({ username });
  if (exist) return res.status(400).json({ message: "Username already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = new User({ username,name,email, password: hashed });

  await newUser.save();
  res.status(201).json({ 
    result : true,
    message: "User registered successful" });
}
// login
export const login =  async (req, res) => {
  const { username, password } = req.body;
if(!username || !password){
  res.status(404).json({
    result : false,
    message : "username and password required"
  })
}
  const user = await User.findOne({ username });
  console.log(user)
  if (!user) return res.status(400).json({ message: "Invalid user" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid Password" });

  const token = jwt.sign({ userId: user._id }, 
      process.env.JWT_SECRET,
    {expiresIn:"24h"} 
  
  );
  
  res.status(200).json({
    result :true,
    message : " login successful",
    token,
    userId : user?._id,
username : user.username
,
  })
}


// get all user info
export const getalluser = async(req,res)=>{
  try {
    const user = await User.find();
    res.status(200).json({
user
    })
} catch (error) {
 res.status(404).json({
  message : error.message
 }) 
}

}

// getUserDetails

export const getUserDetails = async (req,res)=>{
const {userId} = req.query
try {
    console.log(userId)
  if(!userId){
    res.status(404).json({
      result : false,
      message : "query userId required"
    })
  }
  const userDetails = await User.findById(userId)
  res.status(200).json(userDetails)
} catch (error) {
  res.status(404).json({
    result : false,
    message : error.message
  })
}
}

// Update User Profile
export const updateprofile = async (req, res) => {
  const userId = req.params.id;
  const { username, name,bios } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update fields
    if (username) user.username = username;
    if (name) user.name = name;
    if (bios) user.bios = bios

    // ✅ Handle profilePic upload
    if (req.file) {
      user.profilePic = req.file.filename;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        name: updatedUser.name,
        bios : updatedUser.bios,
        profilePic: updatedUser.profilePic,
        email: updatedUser.email,
      }
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// forgot password
export const forgotpassword = async (req,res)=>{
  const { email } = req.body;

  if (!email){
    res.status(404).json({message:"email is required"})
  }

  const user = await User.findOne({ email });
  console.log(user)
  if (!user) return res.status(404).json({ message: "User not found" });

  const token = crypto.randomBytes(32).toString("hex");
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetLink = `http://localhost:5173/reset-password/${token}`;

  // Send email
  try {
    await transporter.sendMail({
      from: "pcmy1092@gmail.com",
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <h2>Reset your password</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 1 hour.</p>
      `,
    });

    res.json({ message: "Reset link sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send email" });
  }
}





// forgot password Api
export const forgotPassword = async (req, res) => {
  const { username,email} = req.body;
 if(!email || !username){res.status(404).json({
    message : "email,username required"
  })
 }

  const user = await User.findOne({ username});
  if (!user) return res.status(404).json({ error: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();

  await transporter.sendMail({
    from: `"Reset Password" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    html: `<p>Your OTP code is <b>${otp}</b>. Valid for 5 minutes.</p>`
  });


  res.json({ success: true, message: "OTP sent to email" });
};

// verifyOtp Api
export const verifyOtp = async (req, res) => {
  const { username, otp } = req.body;
  if(!username|| !otp ){res.status(404).json({
    message : "username,otp required"
  })
 }
  const user = await User.findOne({ username });

  if (!user || user.otp !== otp)
    return res.status(400).json({ error: "Invalid OTP" });

  if (Date.now() > user.otpExpires)
    return res.status(400).json({ error: "OTP expired" });

  res.json({ success: true, message: "OTP verified" });
};

// reset password Api
export const resetPassword = async (req, res) => {
  const { username, newPassword } = req.body;
    if(!username || !newPassword  ){res.status(404).json({
    message : "username,newPassword  required"
  })
 }

  const user = await User.findOne({ username });

  if (!user) return res.status(404).json({ error: "User not found" });

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  user.otp = null;
  user.otpExpires = null;
  await user.save();

  res.json({ success: true, message: "Password reset successful" });
};

