import express from "express";

import { forgotPassword, forgotpassword, getUserDetails,getalluser,
     login, resetPassword, singUp,
      updateprofile, verifyOtp,searchUser, 
      getOtherUserDetails,
      followUser,
      unfollowUser,
      getUserFollowersFollowing} from "../controller/userController.js";
import { upload } from "../controller/uploadController.js";
import { ensureAuthenticated } from "../middleware/auth.js";
// import { getUserFollowersWithStatus } from "../controller/anotheruser.js";

const router = express.Router();


// Register API
router.post("/register",singUp);

// Login API
router.post("/login",login);

// get all user API
router.get("/getalluser",getalluser)

// search user 
router.get("/search",searchUser)

// getUserDetails

router.get("/getUserDetails",ensureAuthenticated,getUserDetails)

router.put('/updateprofile/:id',upload.single("profilePic"),updateprofile)

// get search another user data
router.get("/getOtherUserDetails/:anotherUserID",getOtherUserDetails)


router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

//! user following and followers and unfollow

router.post("/follow", followUser);
router.post("/unfollow", unfollowUser);
router.get("/:userId/follow-data", getUserFollowersFollowing);

// router.get("/user/:targetUserId/followers-with-status", getUserFollowersWithStatus);

export default router;
