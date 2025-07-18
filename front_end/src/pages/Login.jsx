import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer} from 'react-toastify';
import { handleError, handleSuccess } from "../component/notifiction.jsx";

const Login = ({ setUser,userDetails }) => {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginUser = async (e) => {
   
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { username :userName , password });
  
     const { result,message,token,userId,username} = res.data;
     console.log(result)
     localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("userId", userId); 
if(result){
      
      handleSuccess(message)
      setUser(token);
       navigate("/private");
       
      
}else{
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
       
       <Link to="/forgot-password"><p className="text-blue-500 hover:text-blue-700"  >Forgot Password</p></Link>
        <p className="mt-2 text-center text-sm">
          Don’t have an account? <Link className="text-blue-500" to="/register">Register</Link>
        </p>
      </form>
    </div>

     
<ToastContainer
   
/>
    
    </>
  );
};

export default Login;
