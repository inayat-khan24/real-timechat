import express from "express";

import { forgotPassword, forgotpassword, getUserDetails,getalluser,
     login, resetPassword, singUp, updateprofile, verifyOtp,searchUser } from "../controller/userController.js";
import { upload } from "../controller/uploadController.js";
import { ensureAuthenticated } from "../middleware/auth.js";

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




router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;
