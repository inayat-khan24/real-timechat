import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import postRoutes from "./routes/postRoutes.js";

import privateChatRoutes from "./routes/privateChatRoutes.js";
import { connectDB } from "./models/connection.js";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // frontend URL
    methods: ["GET", "POST"],
  },
});

// ✅ SOCKET.IO CONNECTION HANDLER
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Public Chat Message
  socket.on("sendMessage", (data) => {
    io.emit("receiveMessage", data);
  });

  // ✅ Private Chat Join Room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  // ✅ Private Chat Message (to room only)
  socket.on("privateMessage", ({ roomId, messageData }) => {
    io.to(roomId).emit("receivePrivateMessage", messageData);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

// video call
  socket.on("offer", (data) => {
    socket.broadcast.emit("offer", data);
  });

  socket.on("answer", (data) => {
    socket.broadcast.emit("answer", data);
  });

  socket.on("ice-candidate", (data) => {
    socket.broadcast.emit("ice-candidate", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected", socket.id);
  });


});



// ✅ ROUTES
app.get("/", (req, res) => res.send("Socket.IO server running"));

app.use("/api/auth", authRoutes); // Auth APIs
app.use("/api/chat", chatRoutes); // Public Chat APIs
app.use("/api/private", privateChatRoutes); // Private Chat APIs
app.use("/uploads", express.static("uploads"));
/// for post 
app.use('/api/posts', postRoutes);


// ✅ START SERVER
server.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
