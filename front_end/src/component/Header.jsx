import React, { useEffect, useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { IoIosLogOut } from 'react-icons/io';
import { MdAccountCircle } from 'react-icons/md';
import { AiOutlineMessage } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ userDetails, profilePic, name, setUser }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const open = Boolean(anchorEl);

  // Handle open and close for menu
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    setUser(null); // clear user state
    handleClose();
    navigate('/login');
  };

  useEffect(() => {
    userDetails(); // fetch user details on mount
  }, []);

  const profile = profilePic
    ? `http://localhost:5000/uploads/${profilePic}`
    : 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3';

  return (
    <header className="bg-amber-50 w-full border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-3 max-lg:flex-col max-lg:gap-3">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          <Link to="/private" className="flex items-center gap-2 text-[1rem] text-gray-700 hover:text-black">
            <AiOutlineMessage className="text-xl" />
            <span>Messages</span>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Profile Pic */}
       <Link to="/profile">
          <div className="flex items-center gap-2">
            <img
              src={profile}
              alt="User"
              className="w-8 h-8 object-cover rounded-full border"
            />
            <span className="text-sm text-gray-800 font-bold">Profile</span>
          </div>
       </Link>

          {/* Menu Button */}
          <Button
            onClick={handleClick}
            className="capitalize !text-gray-800 !normal-case"
          >
            Menu
          </Button>

          {/* Dropdown Menu */}
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
