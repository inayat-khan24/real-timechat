import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./Chat"; // Public Chat
import PrivateChat from "./PrivateChat"; // Private Chat
import Header from "./component/Header.jsx";
import Account from "./pages/Account.jsx";

function App() {
  const [user, setUser] = useState(localStorage.getItem("username"));

  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account/>} />

        {/* 👇 Public Chat */}
        <Route
          path="/chat"
          element={user ? <Chat username={user} /> : <Navigate to="/login" />}
        />

        {/* 👇 Private Chat */}
        <Route
          path="/private"
          element={user ? <PrivateChat username={user} /> : <Navigate to="/login" />}
        />

        {/* 👇 Default Redirect */}
        <Route path="*" element={<Navigate to={user ? "/private" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
