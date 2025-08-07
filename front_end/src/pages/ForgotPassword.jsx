import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../component/notifiction';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', formData);

      if (res.data.success) {
        handleSuccess(res.data.message || 'OTP sent successfully');

        setTimeout(() => {
          navigate('/verify-otp');
        }, 1500);
      } else {
        handleError(res.data.message || 'Something went wrong!');
      }
    } catch (error) {
      handleError(error.response?.data.message || 'Server Error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Send OTP
          </button>
        </form>

        <div className="mt-4 text-sm text-center text-gray-600">
          Remembered your password?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default ForgotPassword;
