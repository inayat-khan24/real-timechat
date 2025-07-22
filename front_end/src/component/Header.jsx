import React, { useEffect, useState, useRef } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { IoIosLogOut } from 'react-icons/io';
import { MdAccountCircle } from 'react-icons/md';
import { AiOutlineMessage } from 'react-icons/ai';
import { IoCameraOutline, IoSearch } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ userDetails, profilePic, setUser }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedValue, setSubmittedValue] = useState('');

  const open = Boolean(anchorEl);
  const searchRef = useRef(null);

  const profile = profilePic
    ? `http://localhost:5000/uploads/${profilePic}`
    : 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3';

  const userSearch = ["logical143", "soft12","soft", "jooe124"];
  const filteredUsers = userSearch.filter((user) =>
    user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    userDetails();

    // Click outside to close search
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    handleClose();
    navigate('/login');
  };

  const handleClose = () => setAnchorEl(null);
  const handleClick = (e) => setAnchorEl(e.currentTarget);

  const handleProfilePost = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    console.log("Selected file:", file);
  };

  return (
    <header className="bg-white w-full border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left */}
        <div className="flex items-center gap-4">
          <Link to="/private" className="flex items-center gap-2 text-gray-700 hover:text-black text-[1rem]">
            <AiOutlineMessage className="text-xl" />
            <span>Messages</span>
          </Link>

          <label htmlFor="fileInput" className="cursor-pointer text-gray-600 hover:text-black">
            <IoCameraOutline className="text-2xl" />
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={handleProfilePost}
              className="hidden"
            />
          </label>

          {/* Instagram Style Search */}
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => setSearchOpen((prev) => !prev)}
              className="text-xl mt-2 text-gray-600 hover:text-black"
            >
              <IoSearch />
            </button>

            {searchOpen && (
  <div className="absolute left-0 top-12 w-80 bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl shadow-2xl p-4 z-50 animate-fade-in">
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="🔍 Search users..."
      className="w-full border border-gray-300 focus:border-blue-500 transition-all duration-200 px-4 py-2 rounded-lg text-sm mb-3 outline-none placeholder-gray-500"
      autoFocus
    />

    <div className="max-h-60 overflow-y-auto space-y-2">
      {searchTerm.trim() ? (
        filteredUsers.length > 0 ? (
          filteredUsers.map((user, i) => (
            <div
              key={i}
              className="px-4 py-2 bg-gradient-to-r from-yellow-100 to-yellow-200 hover:from-yellow-200 hover:to-yellow-300 rounded-md cursor-pointer text-sm text-gray-800 transition-all duration-150 shadow-sm"
            >
              {user}
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-sm px-4 py-2 bg-gray-100 rounded-md">
            No results found.
          </div>
        )
      ) : (
        <div className="text-gray-400 text-sm px-4 py-2 text-center italic">
          Start typing to search...
        </div>
      )}
    </div>
  </div>
)}

          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <Link to="/profile">
            <div className="flex items-center gap-2">
              <img
                src={profile}
                alt="User"
                className="w-8 h-8 object-cover rounded-full border"
              />
              <span className="text-sm text-gray-800 font-semibold">Profile</span>
            </div>
          </Link>

          <Button
            onClick={handleClick}
            className="!text-gray-800 !normal-case"
          >
            Menu
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              paper: {
                elevation: 1,
                sx: { mt: 1.5, minWidth: 180 },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Link to="/account">
              <MenuItem onClick={handleClose}>
                <MdAccountCircle className="mr-2" /> Account
              </MenuItem>
            </Link>
            <Link to="/register">
              <MenuItem onClick={handleClose}>
                <MdAccountCircle className="mr-2" /> Sign Up
              </MenuItem>
            </Link>
            <MenuItem onClick={handleLogout}>
              <IoIosLogOut className="mr-2" /> Log Out
            </MenuItem>
          </Menu>
        </div>
      </div>
    </header>
  );
};

export default Header;
