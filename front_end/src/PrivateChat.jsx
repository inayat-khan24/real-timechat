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
import { decryptMessage, encryptMessage } from "./cryptoUtil.jsx";

const Base_url = "https://real-timechat-l7bv.onrender.com";
const socket = io(`${Base_url}`);

const PrivateChat = ({ userDetails, setSelectedUserVideo }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [privateChat, setPrivateChat] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
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
    love: "bg-[url('https://www.shutterstock.com/image-photo/valentines-day-love-theme-background-260nw-573985108.jpg')] bg-no-repeat bg-cover",
    emoji: "bg-[url('https://i.pinimg.com/236x/2c/89/b6/2c89b6c8c03f0d953fcf01ce0f15672a.jpg')]",
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${Base_url}/api/auth/getalluser`);
      const result = await res.json();
      setAllUsers(result.user);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const privateChatuser = async () => {
    if (!selectedUser) return;
    const roomId = [username, selectedUser].sort().join("_");
    socket.emit("joinRoom", roomId);

    try {
      const res = await axios.get(
        `${Base_url}/api/private/chat/${username}/${selectedUser}`
      );

      const decryptedMsgs = res.data.messages.map((msg) => ({
        ...msg,
        message: msg.message ? decryptMessage(msg.message) : "",
      }));
      setPrivateChat(decryptedMsgs);
    } catch (err) {
      console.error(err);
    }
  };

  const sendPrivateMessage = async () => {
    if (!selectedUser) return;
    if (!message.trim() && !selectedFile && !selectedVideo) return;

    const roomId = [username, selectedUser].sort().join("_");

    const formData = new FormData();
    formData.append("sender", username);
    formData.append("receiver", selectedUser);
    formData.append("time", new Date().toLocaleTimeString());

    if (selectedFile) formData.append("image", selectedFile);
    if (selectedVideo) formData.append("video", selectedVideo);
    if (message.trim()) formData.append("message", encryptMessage(message));

    const msgToEmit = {
      sender: username,
      receiver: selectedUser,
      message: message.trim() ? message : null,
      image: selectedFile ? URL.createObjectURL(selectedFile) : null,
      video: selectedVideo ? URL.createObjectURL(selectedVideo) : null,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("privateMessage", { roomId, messageData: msgToEmit });

    setMessage("");
    setSelectedFile(null);
    setPreviewImage(null);
    setSelectedVideo(null);
    setPreviewVideo(null);
    setShowEmojiPicker(false);

    try {
      await axios.post(`${Base_url}/api/private/send`, formData, {
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
      const fileType = file.type;
      if (fileType.startsWith("image/")) {
        setSelectedFile(file);
        setSelectedVideo(null);
        setPreviewImage(URL.createObjectURL(file));
        setPreviewVideo(null);
      } else if (fileType.startsWith("video/")) {
        setSelectedVideo(file);
        setSelectedFile(null);
        setPreviewVideo(URL.createObjectURL(file));
        setPreviewImage(null);
      }
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
      const decrypted = {
        ...msg,
        message: msg.message ? decryptMessage(msg.message) : "",
      };
      setPrivateChat((prev) => [...prev, decrypted]);
    });
    return () => socket.off("receivePrivateMessage");
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [privateChat]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 flex justify-center items-center">
      <div className="w-full max-w-7xl h-[90vh] md:h-[80vh] bg-white rounded-2xl shadow-xl flex flex-col lg:flex-row overflow-hidden">
        {/* User List & Theme Selector (Left Pane) */}
        <div
          className={`w-full lg:w-1/3 border-r overflow-y-auto p-4 transition-all duration-300 ${
            selectedUser ? "hidden lg:block" : "block"
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Chats</h2>
            <ThemeSelector theme={theme} setTheme={setTheme} />
          </div>

          {/* User list */}
          <div className="space-y-3">
            {allUsers
              .filter((u) => u.username !== username)
              .map((user, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedUser(user.username);
                    setSelectedUserVideo(user.username);
                  }}
                  className={`flex items-center gap-4 p-3 rounded-xl w-full text-left transition-colors duration-200 ${
                    selectedUser === user.username
                      ? "bg-blue-100 text-blue-800 shadow-md"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <img
                    src={
                      user.profilePic
                        ? `${user.profilePic}`
                        : "https://images.unsplash.com/photo-1633332755192-727a05c4013d"
                    }
                    className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
                    alt="profile"
                  />
                  <span className="text-lg font-medium">{user.username}</span>
                </button>
              ))}
          </div>
        </div>

        {/* Chat window (Right Pane) */}
        <div
  className={`w-full lg:w-2/3 flex flex-col h-full ${
    !selectedUser ? "hidden" : "flex"
  }`}
>
  {selectedUser ? (
    <>
      {/* Chat Header */}
      <div className="p-4 border-b bg-blue-50 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedUser(null)}
            className="lg:hidden p-1 rounded-full hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <span className="text-xl font-semibold">
            Chat with {selectedUser}
          </span>
        </div>
        <Link to="/video-call">
          <TbPhoneCalling className="text-3xl text-blue-500 hover:text-blue-700 transition-colors" />
        </Link>
      </div>

      {/* Chat Messages Area - **SCROLLABLE CONTAINER** */}
      <div
        className={`flex-1 p-4 overflow-y-auto space-y-4 transition-all duration-300 ${themeClasses[theme]}`}
      >
        {privateChat.map((msg, idx) => {
          const isMe = msg.sender === username;
          return (
            <div
              key={idx}
              className={`flex ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-xl shadow-md break-words ${
                  isMe
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-black rounded-bl-none"
                }`}
              >
                <div className="text-sm font-semibold mb-1">
                  {msg.sender}
                </div>
                {msg.image && (
                  <img
                    src={`${msg.image}`}
                    alt="chat"
                    className="mt-1 w-full max-h-60 object-contain rounded-lg cursor-pointer"
                  />
                )}
                {msg.video && (
                  <video
                    src={`${msg.video}`}
                    controls
                    className="mt-1 w-full max-h-60 rounded-lg"
                  />
                )}
                {msg.message && (
                  <div className="text-base">{msg.message}</div>
                )}
                <div className="text-xs text-right mt-2 opacity-80">
                  {msg.time}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Message Input Area */}
      <div className="p-4 border-t bg-white flex items-end gap-3 relative">
        {previewImage && (
          <div className="absolute -top-24 left-4 p-2 bg-white rounded-lg shadow-lg">
            <img
              src={previewImage}
              alt="preview"
              className="h-20 w-20 object-cover rounded-md border"
            />
            <button
              onClick={() => {
                setSelectedFile(null);
                setPreviewImage(null);
              }}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs"
            >
              X
            </button>
          </div>
        )}

        {previewVideo && (
          <div className="absolute -top-24 left-4 p-2 bg-white rounded-lg shadow-lg">
            <video
              src={previewVideo}
              controls
              className="h-20 w-20 object-cover rounded-md border"
            />
            <button
              onClick={() => {
                setSelectedVideo(null);
                setPreviewVideo(null);
              }}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs"
            >
              X
            </button>
          </div>
        )}
        <label className="cursor-pointer">
          <GrGallery className="text-3xl text-gray-600 hover:text-blue-500 transition-colors" />
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        <div className="relative">
          <BsEmojiSmile
            className="text-3xl text-gray-600 cursor-pointer hover:text-yellow-500 transition-colors"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          />
          {showEmojiPicker && (
            <div className="absolute bottom-12 left-0 z-50">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>

        <textarea
          type="text"
          placeholder="Type a message..."
          className="flex-1 resize-none border rounded-full px-5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 max-h-[100px] overflow-y-auto"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendPrivateMessage()}
          rows={1}
        />

        <button
          onClick={sendPrivateMessage}
          className="bg-blue-500 rounded-full text-white w-12 h-12 flex items-center justify-center hover:bg-blue-600 transition-colors"
        >
          <RiSendPlaneFill className="text-2xl" />
        </button>
      </div>
    </>
  ) : (
    <div className="flex items-center justify-center h-full text-gray-500 text-xl font-medium">
      Select a user to start chatting
    </div>
  )}
</div>
      </div>
    </div>
  );
};

export default PrivateChat;