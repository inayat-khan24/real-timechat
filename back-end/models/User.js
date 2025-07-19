import mongoose from "mongoose";
import { postSchema } from "./Post.js";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name : {type:String,required:true},
  profilePic: String,
  email : {
     type: String,
    required: true,
    unique: true,
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
  }
);

export const User = mongoose.model("User", userSchema);
