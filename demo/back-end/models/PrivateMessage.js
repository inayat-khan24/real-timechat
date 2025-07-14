import mongoose from "mongoose";

const privateMessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  message: { type: String, required: true },
  time: { type: String, required: true }
}, { timestamps: true });

export const PrivateMessage = mongoose.model("PrivateMessage", privateMessageSchema);
