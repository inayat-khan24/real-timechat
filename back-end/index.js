import express from "express";
import http from "http";
import { Server } from "socket.io";

import cors from "cors";
import authRoutes  from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { connectDB } from "./models/connection.js";


const app = express();
app.use(cors());
app.use(express.json());

connectDB()

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // frontend URL
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendMessage", (data) => {
    io.emit("receiveMessage", data); // broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.get("/", (req, res) => res.send("Socket.IO server running"));

// auth Api 
app.use("/api/auth", authRoutes);
// chat routes
app.use("/api/chat", chatRoutes);

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
