import express from "express";
import multer from "multer";


const router = express.Router();

// Upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "postUploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

export  const Postupload = multer({ storage });
