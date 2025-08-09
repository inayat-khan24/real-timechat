import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../component/notifiction.jsx";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ setUser }) => {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const Base_url = "https://real-timechat-l7bv.onrender.com"
 

  const loginUser = async (e) => {
    e.preventDefault();

    if (!userName || !password) {
      return handleError("Please fill all fields");
    }

    try {
      const res = await axios.post(`${Base_url}/api/auth/login`, {
        username: userName,
        password,
      });

      const { result, message, token, userId, username } = res.data;

      if (result) {
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        localStorage.setItem("userId", userId);
        setUser(token);
        handleSuccess("Login successful! 🎉");
        setTimeout(() => navigate("/"), 1000);
      } else {
        handleError(message || "Invalid credentials");
      }
    } catch (err) {
      handleError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong!"
      );
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 p-4">
        <form
          onSubmit={loginUser}
          className="w-full max-w-sm bg-white/30 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/40"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Welcome Back 👋
          </h2>

          <input
            type="text"
            className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Username or Email"
            value={userName}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />

          <input
            type="password"
            className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg hover:opacity-90 transition-all font-semibold"
          >
            Login
          </button>

          <div className="mt-3 flex justify-between text-sm text-blue-700">
            <Link to="/forgot-password" className="hover:underline">
              Forgot Password?
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </div>
        </form>
      </div>

      <ToastContainer />
    </>
  );
};

export default Login;
