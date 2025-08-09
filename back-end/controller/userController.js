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
// export const updateprofile = async (req, res) => {
//   const userId = req.params.id;
//   const { username, name,bios } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Update fields
//     if (username) user.username = username;
//     if (name) user.name = name;
//     if (bios) user.bios = bios

//     // ✅ Handle profilePic upload
//     if (req.file) {
//       user.profilePic = req.file.filename;
//     }

//     const updatedUser = await user.save();

//     res.status(200).json({
//       message: "Profile updated successfully",
//       user: {
//         id: updatedUser._id,
//         username: updatedUser.username,
//         name: updatedUser.name,
//         bios : updatedUser.bios,
//         profilePic: updatedUser.profilePic,
//         email: updatedUser.email,
//       }
//     });
//   } catch (error) {
//     console.error("Update Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const updateprofile = async (req, res) => {
  const userId = req.params.id;
  const { username, name, bios } = req.body;

  console.log("📤 Uploaded File:", req.file); // Debug

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (username) user.username = username;
    if (name) user.name = name;
    if (bios) user.bios = bios;

    if (req.file) {
      user.profilePic = req.file.path; // Cloudinary ka secure_url
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        name: updatedUser.name,
        bios: updatedUser.bios,
        profilePic: updatedUser.profilePic,
        email: updatedUser.email,
      }
    });
  } catch (error) {
    console.error("❌ Update Error:", error); // Full object log
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
      error: error.stack
    });
  }
};









// forgot password Api
export const forgotPassword = async (req, res) => {
  const { username, email } = req.body;

  // Check if both fields are provided
  if (!email || !username) {
    return res.status(400).json({
      success: false,
      message: "Username and email are required",
    });
  }

  // Find user by username
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Check if email matches the user
  if (user.email !== email) {
    return res.status(400).json({
      success: false,
      message: "Email does not match ",
    });
  }

  // Generate OTP and expiry
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // Save to user document
  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();

  // Send OTP via email
  await transporter.sendMail({
    from: `"Reset Password" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    html: `<p>Your OTP code is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
  });

  res.json({
    success: true,
    message: "OTP sent to your email",
  });
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

// search user 
// export const searchUser = async(req,res)=>{
// try {
//   const userSearch = await User.find()
// console.log(userSearch)
//   res.status(200).json({
//     success : true,
//     userSearch

//   })
// } catch (error) {
//   res.status(404).json({
//     success : false ,
//     message : error.message
//   })
// }
// }

export const searchUser = async (req, res) => {
  try {
    if(!User){
res.status(404).json({
  success : false,
  message : "user not found"
})
    } else {
  const userSearch = await User.find().select("name username profilePic");
   res.status(200).json({
      success: true,
      users: userSearch
    });
    }
  

   
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};
 

// get another user data

export const getOtherUserDetails = async(req,res)=>{

const {anotherUserID} = req.params



try {
    
  if(!anotherUserID){
    res.status(404).json({
      result : false,
      message : "params anotherUserID required"
    })
  }
  const AnotherUserID = await User.find({ username: anotherUserID });
  
  // const AnotherUserID = await User.findOne({anotherUserID})
  res.status(200).json(AnotherUserID)
} catch (error) {
  res.status(404).json({
    result : false,
    message : error.message
  })
}

}


//! user following and followers and unfollowng


export const followUser = async (req, res) => {
  try {
    const { currentUserId, targetUserId,isFollow} = req.body;
   console.log(isFollow)
if(!currentUserId || !targetUserId){
  return res.status(404).json({
    success : false,
    message : "currentUserId, targetUserId  required"
  })
}


    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "You can't follow yourself." });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);
 

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const isAlreadyFollowing = currentUser.following?.some(
      (f) => f.userId?.toString() === targetUserId
    );

    if (isAlreadyFollowing) {
      return res.status(400).json({ message: "Already following this user." });
    }

    currentUser.following.push({
      userId: targetUser._id,
      username: targetUser.username,
      profilePic: targetUser.profilePic || null,
      
    });

    targetUser.followers.push({
      userId: currentUser._id,
      username: currentUser.username,
      profilePic: currentUser.profilePic || null,
      isFollow 
    });

    await currentUser.save();
    await targetUser.save();

    return res.status(200).json({ message: "User followed successfully." });

  } catch (err) {
    console.error("Follow Error:", err);
    return res.status(500).json({ error: err.message });
  }
};


// Unfollow a user
export const unfollowUser = async (req, res) => {
  try {
    const { currentUserId, targetUserId,isFollow} = req.body;

    
 if (!currentUserId || !targetUserId ) {
      return res.status(404).json({ message: "currentUserId, targetUserId required " });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Remove from following
    currentUser.following = currentUser.following.filter(
      (f) => f.userId.toString() !== targetUserId
    );

    // Remove from followers
    targetUser.followers = targetUser.followers.filter(
      (f) => f.userId.toString() !== currentUserId
    );

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({ message: "User unfollowed successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get followers and following with user info


export const getUserFollowersFollowing = async (req, res) => {
  try {
    const { userId } = req.params; // jis user ke followers dekhne hain
    const currentUserId = req.query.currentUserId; // currently logged-in user ka ID query me aayega

    // validate IDs
    if (!userId || !currentUserId) {
      return res.status(400).json({ message: "userId and currentUserId are required" });
    }

    const user = await User.findById(userId).lean(); // lean() is used to get plain JS object
    const currentUser = await User.findById(currentUserId).lean();

    if (!user || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Set of IDs that current user is following
    const followingSet = new Set(currentUser.following.map(f => f.userId.toString()));

    // Map followers with isFollow flag
    const followersWithStatus = user.followers.map(follower => ({
      ...follower,
      isFollow: followingSet.has(follower.userId.toString()),
    }));

       const followingWithStatus = user.following.map(following => ({
      ...following,
      isFollow: followingSet.has(following.userId.toString()),
    }));

    res.status(200).json({ followers: followersWithStatus,
      following : followingWithStatus
     });
  } catch (err) {
    console.error("Get Followers Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};


export const loginFollowersFollowing = async (req, res) => {
  try {
   const { userId } = req.params;
  

    // Check if both IDs exist
    if (!userId) {
      return res.status(400).json({ error: "Missing userId or currentUserId" });
    }

    // Validate IDs format
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(userId) || !objectIdRegex.test(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Get the user whose followers/following we're checking
    const user = await User.findById(userId)
      .populate("followers.userId", "username profilePic")
      

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Get logged-in user's following list to determine isFollow
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found." });
    }

    // Build a Set of currentUser's following IDs for quick lookup
    const currentUserFollowingSet = new Set(
      currentUser.following.map((f) => f.userId.toString())
    );

    // Add isFollow to each follower
    const followersWithFollowStatus = user.followers.map((follower) => {
      return {
        ...follower.toObject(),
        isFollow: currentUserFollowingSet.has(follower.userId._id.toString()),
      };
    });

    res.status(200).json({
      followers: followersWithFollowStatus,
      following: user.following,
    });
  } catch (err) {
    console.error("Error in loginFollowersFollowing:", err);
    res.status(500).json({ error: err.message });
  }
};

// login user feed 






export const Feeds = async (req, res) => {
  try {
    const userId = req.query.userId;
console.log(userId)
    // Step 1: Find logged-in user
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Step 2: Get list of followed users' IDs + self
    const followingIds = user.following.map(f => f.userId.toString());
    followingIds.push(userId); // include self

    // Step 3: Find all these users
    const users = await User.find({ _id: { $in: followingIds } });

    // Step 4: Extract all posts and attach user info
    const feedPosts = [];

    users.forEach(u => {
      u.posts.forEach(post => {
        feedPosts.push({
          ...post.toObject(),
          userId: {
            _id: u._id,
            username: u.username,
            name: u.name,
            profilePic: u.profilePic,
          }
        });
      });
    });

    // Step 5: Sort by createdAt (latest first)
    feedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json(feedPosts);
  } catch (err) {
    console.error("Feed Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
