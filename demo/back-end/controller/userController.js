import bcrypt from "bcryptjs";
import dotenv from 'dotenv'; 

dotenv.config();


import jwt from "jsonwebtoken";
import path from "path";
import { User } from "../models/User.js";


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
  const { username, name } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update fields
    if (username) user.username = username;
    if (name) user.name = name;

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
        profilePic: updatedUser.profilePic,
        email: updatedUser.email,
      }
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
