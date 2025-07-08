import express from "express";
import { PrivateMessage } from "../models/PrivateMessage.js";

const router = express.Router();

// Save private message
router.post("/send", async (req, res) => {
  const { sender, receiver, message, time } = req.body;
  try {
    const newMsg = new PrivateMessage({ sender, receiver, message, time });
    await newMsg.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get chat between two users
router.get("/chat/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;
 

  try {
    const messages = await PrivateMessage.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    }).sort({ createdAt: 1 });

    
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
