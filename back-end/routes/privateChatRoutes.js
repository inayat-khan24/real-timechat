import express from "express";
import { PrivateMessage } from "../models/PrivateMessage.js";
import { User } from "../models/User.js";

import { privateChatPic } from "../CloudinaryStorage/privateChatupload.js";

const router = express.Router();

// ✅ Save private message
// router.post("/send",upload.single("image"), async (req, res) => {
//   const { sender, receiver, message, time } = req.body;
//   const image = req.file?.filename || null;

//   if (!message && !image) {
//     return res.status(400).json({ error: "Either message or image is required" });
//   }
//   try {
//     const newMsg = new PrivateMessage({ sender, receiver, message, image, time });
//     await newMsg.save();
//     res.status(201).json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
router.post("/send", privateChatPic.single("image"), async (req, res) => {
  try {
    // Debug logs
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { sender, receiver, message, time } = req.body;

    // ✅ Cloudinary ka direct URL
    const image = req.file?.path || null;

    // Save message
    const newMsg = new PrivateMessage({
      sender,
      receiver,
      message: message || "", // optional field
      image, // yeh ab Cloudinary ka secure_url hoga
      time,
    });

    await newMsg.save();

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      data: newMsg
    });

  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Something went wrong",
    });
  }
});



// ✅ Get chat between two users + receiver profile image
router.get("/chat/:user1/:user2", async (req, res) => { 
  const { user1, user2 } = req.params;
// console.log("Sender User:", user1)
  try {
    // 📌 Find receiver's user details
    const receiverUser = await User.findOne({ username: user2 });
    const senderUser = await User.findOne({username: user1 })


    // 📌 If receiver not found, still send empty profile
    const receiverProfile = receiverUser?.profilePic || "";
      const senderProfile = senderUser?.profilePic || "";

    // 📌 Fetch chat messages between user1 and user2
    const messages = await PrivateMessage.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ createdAt: 1 });

    // ✅ Respond with messages + profilePic
    res.status(200).json({
      messages,
      receiverProfile,
      senderProfile 

    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
