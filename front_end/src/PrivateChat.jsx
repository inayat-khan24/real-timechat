import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { TbPhoneCalling } from "react-icons/tb";
import { GrGallery } from "react-icons/gr";
import { Link } from "react-router-dom";
import ThemeSelector from "./component/ThemeSelector.jsx";
import { RiSendPlaneFill } from "react-icons/ri";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";

const socket = io("http://localhost:5000");

const PrivateChat = ({ userDetails, setSelectedUserVideo }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [privateChat, setPrivateChat] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [theme, setTheme] = useState("default");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatEndRef = useRef(null);
  const username = localStorage.getItem("username");

  const themeClasses = {
    default: "bg-gray-50 text-black",
    dark: "bg-gray-900 text-white",
    gradient: "bg-gradient-to-br from-purple-100 to-blue-100 text-black",
    BgStock:
      "bg-[url('https://static.vecteezy.com/system/resources/thumbnails/035/719/133/small_2x/ai-generated-abstract-golden-wave-on-black-background-vector-illustration-for-your-design-abstract-golden-lines-on-black-bg-ai-generated-free-photo.jpg')] bg-cover bg-center bg-no-repeat bg-fixed h-screen w-full",
    love:
      "bg-[url('https://www.shutterstock.com/image-photo/valentines-day-love-theme-background-260nw-573985108.jpg')] bg-no-repeat bg-cover",
    emoji:
      "bg-[url('https://i.pinimg.com/236x/2c/89/b6/2c89b6c8c03f0d953fcf01ce0f15672a.jpg')] ",
  };

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/api/auth/getalluser");
    const result = await res.json();
    setAllUsers(result.user);
  };

  const privateChatuser = async () => {
    if (!selectedUser) return;
    const roomId = [username, selectedUser].sort().join("_");
    socket.emit("joinRoom", roomId);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/private/chat/${username}/${selectedUser}`
      );
      setPrivateChat(res.data.messages);
    } catch (err) {
      console.error(err);
    }
  };

  const sendPrivateMessage = async () => {
    if (!selectedUser || (!message.trim() && !selectedFile)) return;

    const roomId = [username, selectedUser].sort().join("_");

    const formData = new FormData();
    formData.append("sender", username);
    formData.append("receiver", selectedUser);
    formData.append("time", new Date().toLocaleTimeString());

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    if (message.trim()) {
      formData.append("message", message);
    }

    const msgToEmit = {
      sender: username,
      receiver: selectedUser,
      message: message || "",
      image: selectedFile ? URL.createObjectURL(selectedFile) : null,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("privateMessage", { roomId, messageData: msgToEmit });

    setMessage("");
    setSelectedFile(null);
    setPreviewImage(null);
    setShowEmojiPicker(false);

    try {
      await axios.post("http://localhost:5000/api/private/send", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      privateChatuser();
    } catch (err) {
      console.error("Failed to send", err.response?.data || err.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleEmojiClick = (emojiData) => {
   
    setMessage((prev) => prev + emojiData.emoji);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    privateChatuser();
  }, [selectedUser]);

  useEffect(() => {
    socket.on("receivePrivateMessage", (msg) => {
      setPrivateChat((prev) => [...prev, msg]);
    });
    return () => socket.off("receivePrivateMessage");
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [privateChat]);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-6xl h-[80vh] bg-white rounded-xl shadow-xl flex flex-col lg:flex-row overflow-hidden">
        {/* Theme Selector - mobile */}
        <div className="w-full p-2 bg-white flex justify-end border-b lg:hidden">
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="px-3 py-1 rounded-md border text-sm focus:outline-none"
          >
            <option value="default">Default</option>
            <option value="dark">Dark</option>
            <option value="gradient">Gradient</option>
            <option value="BgStock">BgStock</option>
            <option value="love">Love</option>
            <option value="emoji">Emoji</option>
          </select>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/3 border-r overflow-y-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Users</h2>
            <ThemeSelector theme={theme} setTheme={setTheme} />
          </div>

          {allUsers
            .filter((u) => u.username !== username)
            .map((user, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedUser(user.username);
                  setSelectedUserVideo(user.username);
                }}
                className={`flex items-center gap-3 p-2 rounded-lg w-full text-left ${
                  selectedUser === user.username
                    ? "bg-blue-200"
                    : "hover:bg-gray-100"
                }`}
              >
                <img
                  src={`http://localhost:5000/uploads/${user.profilePic}`}
                  className="h-8 w-8 rounded-full"
                  alt="pf"
                />
                <span>{user.username}</span>
              </button>
            ))}
        </div>

        {/* Chat Window */}
        <div className="w-full lg:w-2/3 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b bg-blue-50 flex justify-between items-center">
            <span className="font-medium">Chat with {selectedUser}</span>
            <Link to="/video-call">
              <TbPhoneCalling className="text-2xl" />
            </Link>
          </div>

          {/* Messages */}
          <div
            className={`flex-1 p-4 overflow-y-auto space-y-4 transition-all duration-300 ${themeClasses[theme]}`}
          >
            {privateChat.map((msg, idx) => {
              const isMe = msg.sender === username;
              return (
                <div
                  key={idx}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-md shadow ${
                      isMe ? "bg-blue-500 " : "bg-[gray]"
                    }`}
                  >
                    <div className="text-sm font-semibold">{msg.sender}</div>
                    {msg.image ? (
                      <img
                        src={`http://localhost:5000/uploads/${msg.image}`}
                        alt="chat"
                        className="mt-1 max-w-[200px] rounded-md"
                      />
                    ) : (
                      <div
                        className={`${
                          theme === "dark" ? "text-white" : "text-black"
                        }`}
                      >
                        {msg.message}
                      </div>
                    )}
                    <div className="text-[10px] text-right mt-1 opacity-70">
                      {msg.time}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          {selectedUser && (
            <div className="p-4 border-t bg-white flex items-center gap-2 relative">
              {/* Image Upload */}
              <label>
                <GrGallery className="text-2xl text-gray-600 cursor-pointer" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              {/* Emoji Picker */}
              <div className="relative">
                <BsEmojiSmile
                  className="text-2xl text-gray-600 cursor-pointer"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                />
                {showEmojiPicker && (
                  <div className="absolute bottom-12 left-0 z-50">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                )}
              </div>

              {/* Message Input */}
              <input
                type="text"
                placeholder="Type message..."
                className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendPrivateMessage()}
              />

              <button
                onClick={sendPrivateMessage}
                className="bg-blue-500 rounded-[200px] text-white px-4 py-2"
              >
                <RiSendPlaneFill className="text-2xl" />
              </button>

              {previewImage && (
                <div className="absolute bottom-16 left-4">
                  <img
                    src={previewImage}
                    alt="preview"
                    className="h-20 w-20 object-cover rounded border"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivateChat;
