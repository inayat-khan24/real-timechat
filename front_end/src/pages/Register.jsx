import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { handleError, handleSuccess } from "../component/notifiction";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });
 const Base_url = "https://real-timechat-l7bv.onrender.com"
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const registerUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${Base_url}/api/auth/register`, formData);
      handleSuccess("Registered! Please login.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      handleError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-300 via-blue-300 to-purple-300 p-4">
        <form
          onSubmit={registerUser}
          className="w-full max-w-sm bg-white/30 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/40"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Create Account 📝
          </h2>

          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg hover:opacity-90 transition-all font-semibold"
          >
            Register
          </button>

          <p className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-700 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>

      <ToastContainer />
    </>
  );
};

export default Register;
