import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("https://real-timechat-l7bv.onrender.com");

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
const username  = localStorage.getItem("username")
  // ✅ Load old messages on first load
  useEffect(() => {
    axios.get("https://real-timechat-l7bv.onrender.com/api/chat/all")
      .then((res) => setChat(res.data))
      .catch((err) => console.error("Error loading messages", err));
  }, []);

  // ✅ Listen for incoming real-time messages
  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  // ✅ Send + store message
  const sendMessage = async () => {
    if (message.trim()) {
      const data = {
        username,
        message,
        time: new Date().toLocaleTimeString(),
      };

      socket.emit("sendMessage", data); // send to all clients
      setMessage("");

      try {
        await axios.post("https://real-timechat-l7bv.onrender.com/api/chat/send", data); // save to MongoDB
      } catch (err) {
        console.error("Failed to save message", err);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
          Chat as {username}
        </h2>

        <div className="h-64 overflow-y-auto border border-gray-300 p-3 rounded mb-4 bg-gray-50">
          {chat.map((msg, i) => (
            <div key={i} className="mb-2">
              <span className="text-sm font-semibold text-blue-600">
                {msg.username}
              </span>
              <span className="text-sm text-gray-500 ml-2">{msg.time}</span>
              <p className="ml-1 text-gray-800">{msg.message}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type message..."
            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
