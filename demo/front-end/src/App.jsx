import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./Chat"; // Public Chat
import PrivateChat from "./pages/PrivateChat.jsx"; // Private Chat
import Header from "./component/Header.jsx";
import Account from "./pages/Account.jsx";

function App() {
    const [userInfo, setUserInfo] = useState({
      name: '',
      username: '',
      email: '',
      profilePic: ''
    });
     const [editedData, setEditedData] = useState({});
      const [profilePic,setProfilePic] = useState()
      const [name,setName] = useState("Guest")
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(token);
   const userId = localStorage.getItem("userId");
    const userDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/auth/getUserDetails?userId=${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        setUserInfo(data);
        setEditedData(data);
        setProfilePic(data.profilePic);
      setName(data.name)
      } catch (err) {
        console.error("Failed to fetch user details", err);
      }
    };
 
  return (
    <Router>
      <Header
      setUser={setUser}
      name = {name}
      profilePic={profilePic} userDetails={userDetails}/>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} userDetails={userDetails} />} />
        {/* <Route path="/register" element={<Register/>} /> */}
         <Route path="/register" element={
          user? 
          <PrivateChat userDetails={userDetails} username={user} /> :<Register/>} />
        <Route path="/account" element={<Account userDetails={userDetails}
        editedData = {editedData}
        setEditedData ={setEditedData}
        userInfo ={userInfo}
         
        />} />

        {/* 👇 Public Chat */}
        <Route
          path="/chat"
          element={user ? <Chat username={user} /> : <Navigate to="/login" />}
        />

        {/* 👇 Private Chat */}
        <Route
          path="/private"
          element={user ? <PrivateChat userDetails={userDetails} username={user} /> : <Navigate to="/login" />}
        />

        {/* 👇 Default Redirect */}
        <Route path="*" element={<Navigate to={user ? "/private" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
