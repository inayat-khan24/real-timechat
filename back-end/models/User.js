import mongoose from "mongoose";
import { postSchema } from "./Post.js";
import { type } from "os";

// Define embedded subdocuments for followers and following
const followerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  username: String,
  profilePic: String,
  
  createdAt: { type: Date, default: Date.now },
});

const followingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: String,
  profilePic: String,
  isFollow : {type: Boolean, default:false} ,
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  profilePic: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  followers: {
    type: [followerSchema],
    default: [],
  },
  following: {
    type: [followingSchema],
    default: [],
  },
  bios: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  posts: [postSchema],
  otp: String,
  otpExpires: Date
},
{
  timestamps: true,
});

export const User = mongoose.model("User", userSchema);
