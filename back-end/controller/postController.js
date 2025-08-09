import { User } from "../models/User.js";

export const addPostToUser = async (req, res) => {
  const { userId, caption } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Cloudinary URL
    const PostImage = req.file?.path; // ✅ Cloudinary ka secure_url
    console.log("Uploaded Image URL:", PostImage);

    const newPost = {
      caption,
      PostImage
    };

    user.posts.push(newPost);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Post added successfully",
      posts: user.posts
    });

  } catch (err) {
    console.error("Add Post Error:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
