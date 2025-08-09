



import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

// 🔹 Cloudinary config (ye env se lena best practice hai)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "privateChat_pics", // folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    
  },
});

export const privateChatPic = multer({ storage });
