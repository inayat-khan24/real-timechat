import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";


const router = express.Router();
const JWT_SECRET = "your-secret-key"; // use dotenv in real apps

// Register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const exist = await User.findOne({ username });
  if (exist) return res.status(400).json({ message: "Username already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashed });

  await newUser.save();
  res.status(201).json({ message: "User registered" });
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: "Invalid user" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid Password" });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" });
  res.json({ token, username });
});

router.get("/getalluser",async(req,res)=>{
  try {
    const user = await User.find();
    res.status(200).json({
user
    })
} catch (error) {
 res.status(404).json({
  message : error.message
 }) 
}

})

export default router;
