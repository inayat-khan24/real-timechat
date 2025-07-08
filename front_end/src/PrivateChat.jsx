import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

const PrivateChat = ({ username }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [privateChat, setPrivateChat] = useState([]);
  const [message, setMessage] = useState("");


  // ✅ Fetch all users from backend
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/getalluser");
      const result = await res.json();
  
        setAllUsers(result.user);
    
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  // ✅ Join room and load previous chat
  useEffect(() => {
    if (selectedUser) {
      const roomId = [username, selectedUser].sort().join("_");
      socket.emit("joinRoom", roomId);

      axios
        .get(`http://localhost:5000/api/private/chat/${username}/${selectedUser}`)
        .then((res) => setPrivateChat(res.data))
        .catch((err) => console.error("Error loading private messages", err));
    }
  }, [selectedUser, username]);

  // ✅ Listen to incoming private messages
  useEffect(() => {
    socket.on("receivePrivateMessage", (msg) => {
      setPrivateChat((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receivePrivateMessage");
    };
  }, []);

  // ✅ Load users on first load
  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Send private message
  const sendPrivateMessage = async () => {
    if (!selectedUser || !message.trim()) return;

    const msg = {
      sender: username,
      receiver: selectedUser,
      message,
      time: new Date().toLocaleTimeString(),
    };

    const roomId = [username, selectedUser].sort().join("_");
    socket.emit("privateMessage", { roomId, messageData: msg });
    setMessage("");

    try {
      await axios.post("http://localhost:5000/api/private/send", msg);
    } catch (err) {
      console.error("Failed to save private message", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg flex overflow-hidden">
        
        {/* Sidebar with user list */}
        <div className="w-1/3 border-r p-4">
          <h2 className="text-xl font-bold mb-4">Users</h2>
        {allUsers
  .filter((u) => u.username !== username)
  .map((user, idx) => (
    <button
      key={idx}
      onClick={() => setSelectedUser(user.username)} // we only use username for chat
      className={`block w-full text-left p-2 rounded ${
        selectedUser === user.username ? "bg-blue-200" : "hover:bg-gray-200"
      }`}
    >
      {user.username}
    </button>
  ))}

        </div>

        {/* Chat window */}
        <div className="w-2/3 flex flex-col">
          <div className="border-b p-4 font-semibold text-blue-600">
            {selectedUser ? `Chat with ${selectedUser}` : "Select a user to start"}
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {privateChat.map((msg, i) => (
              <div
                key={i}
                className={`mb-3 p-2 rounded ${
                  msg.sender === username
                    ? "bg-blue-100 text-right"
                    : "bg-gray-200 text-left"
                }`}
              >
                <div className="text-sm font-medium">{msg.sender}</div>
                <div>{msg.message}</div>
                <div className="text-xs text-gray-500">{msg.time}</div>
              </div>
            ))}
          </div>

          {selectedUser && (
            <div className="flex border-t p-3 gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendPrivateMessage()}
              />
              <button
                onClick={sendPrivateMessage}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivateChat;
