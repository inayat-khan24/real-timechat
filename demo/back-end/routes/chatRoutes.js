import express from "express";
import { Message } from "../models/Message.js";

const router = express.Router();

// Save message
router.post("/send", async (req, res) => {
  const { username, message, time } = req.body;
  try {
    const newMsg = new Message({ username, message, time });
    await newMsg.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all messages
router.get("/all", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 }); // oldest first
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
