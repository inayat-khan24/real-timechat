import express from "express";

import { getUserDetails,getalluser, login, singUp, updateprofile } from "../controller/userController.js";
import { upload } from "../controller/uploadController.js";

const router = express.Router();


// Register API
router.post("/register",singUp);

// Login API
router.post("/login",login);

// get all user API
router.get("/getalluser",getalluser)

// getUserDetails

router.get("/getUserDetails",getUserDetails)

router.put('/updateprofile/:id',upload.single("profilePic"),updateprofile)

export default router;
