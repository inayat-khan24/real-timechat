import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer} from 'react-toastify';
import { handleError, handleSuccess } from "../component/notifiction.jsx";

const Login = ({ setUser }) => {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginUser = async (e) => {
   
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { username :userName , password });
   console.log(res.data.username)
     const { result,message,token,userId,username} = res.data;
     
      
if(result === true){
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("userId", userId);
      handleSuccess(message)
       navigate("/");
}else if (result === false){
handleError(message)
  
}

      
     
    } catch (err) {
      // handleError(err.response.data.message);
    }
  };

  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={loginUser} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="w-full mb-3 p-2 border rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Login</button>
        <p className="mt-2 text-center text-sm">
          Don’t have an account? <a className="text-blue-500" href="/register">Register</a>
        </p>
      </form>
    </div>

     
<ToastContainer
   
/>
    
    </>
  );
};

export default Login;
