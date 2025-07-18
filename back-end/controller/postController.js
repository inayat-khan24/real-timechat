import { User } from "../models/User.js";


export const addPostToUser = async (req, res) => {
  const { userId, caption, PostImage} = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const newPost = {
      caption,
     PostImage
    };

    user.posts.push(newPost);  // Push new post to array
    await user.save();

    res.status(200).json({ success: true, message: "Post added", posts: user.posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
