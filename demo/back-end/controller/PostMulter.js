import multer from "multer";
import fs from "fs";
import path from "path";

// 📁 Folder path
const uploadDir = "postUploads";

// 📌 Check and create folder if not exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 📦 Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

export const Postupload = multer({ storage });
