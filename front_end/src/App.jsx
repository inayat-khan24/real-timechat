import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./Chat"; // Public Chat
import PrivateChat from "./PrivateChat.jsx"; // Private Chat
import Header from "./component/Header.jsx";
import Account from "./pages/Account.jsx";
import ForgotPassword from "./pages/forgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import VerifyOtp from "./pages/Verify.jsx";
import VideoCall from "./pages/VideoCall.jsx";
import Profile from "./pages/Profile.jsx";
import UserInfo from "./pages/userInfo.jsx";
import Followers from "./pages/Followers.jsx";
import Following from "./pages/Following.jsx";
import UserFollowers from "./pages/UserFollowers.jsx";
import UserFollowing from "./pages/UserFollowing.jsx";
import Feeds from "./pages/Feeds.jsx";

function App() {
    const [userInfo, setUserInfo] = useState({
      name: '',
      username: '',
      email: '',
      profilePic: ''
    });
     const [editedData, setEditedData] = useState({});
     const [selectedUserVideo,setSelectedUserVideo] = useState(null)
     
      const [profilePic,setProfilePic] = useState()
      const [name,setName] = useState("Guest")
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(token);
   const userId = localStorage.getItem("userId");
   const targetUserId = localStorage.getItem('anotherUser');
   const Base_url = "https://real-timechat-l7bv.onrender.com"
    const userDetails = async () => {
      try {
        const res = await fetch(`${Base_url}/api/auth/getUserDetails?userId=${userId}`, {
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
      {user&&    <Header
      setUser={setUser}
      user = {user }
      name = {name}
      profilePic={profilePic} userDetails={userDetails}/>
      }
    
      <Routes>

          <Route path="/" 
          
           element={user ? <Feeds/> : <Navigate to="/login" />}
          
          />
        <Route path="/login" element={<Login setUser={setUser} userDetails={userDetails} />} />
        // forgotPassword
         <Route path="/forgot-password" element={<ForgotPassword/>} />
         <Route path="/verify-otp" element={<VerifyOtp/>} />
         <Route path="/reset-password" element={<ResetPassword/>} />
         // forgotPassword end

          <Route path="/video-call" element={<VideoCall selectedUserVideo={selectedUserVideo} />} />
        {/* <Route path="/register" element={<Register/>} /> */}
         <Route path="/register" element={
          user? 
          <PrivateChat
          setSelectedUserVideo={setSelectedUserVideo}
           userDetails={userDetails} 
           username={user} /> :<Register/>} />
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
          element={user ? <PrivateChat
            setSelectedUserVideo={setSelectedUserVideo}
            userDetails={userDetails} username={user} /> : <Navigate to="/login" />}
        />
// user profile 
 
           {/* element={user ? <Feeds/> : <Navigate to="/login" />} */}
  <Route path="/profile"
   
      element={user ? 
        <Profile profilePic={profilePic}
  userDetails={userDetails} 
  userInfo = {userInfo}
  />
        : <Navigate to="/login" />}
    />

  // user profile 
  <Route path="/:anotherUserID" element={<UserInfo/>} />

  // followers and following
  {/* <Route path="/:anotherUserID/followers" element={<Followers/>} />
  <Route path="/:anotherUserID/following" element={<Following/>} /> */}
<Route path="/:anotherUserID/followers" element={targetUserId? <Followers/> : <UserFollowers/>} />
<Route path="/:anotherUserID/following" element={targetUserId? <Following/> :  <UserFollowing/>} /> 
        {/* 👇 Default Redirect */}
        <Route path="*" element={<Navigate to={user ? "/private" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
