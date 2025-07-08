import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IoIosLogOut } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLogin, setIsLogin] = useState(true); // For demo, assume true
    const navigate = useNavigate();

  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const userName = localStorage.getItem('username') || 'Guest';
 

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLogin(false);
    handleClose(); // Close menu after logout
     navigate('/login')
  };

  return (
    <header className="bg-amber-50 w-full flex max-lg:flex-col justify-around items-center border-b border-gray-200 shadow-sm">
      <Button
        className="flex items-center max-sm:w-full gap-2"
        onClick={handleClick}
      >
        <div className="!bg-[#f1f1f1] !rounded-full !h-10 !w-10 !min-w-10 flex items-center justify-center p-0">
          <img
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3"
            alt="user profile"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="sm:flex flex-col items-start text-xs">
          <span className="font-semibold capitalize text-black/70">
            {userName}
          </span>
        </div>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: { mt: 1.5, minWidth: 180 },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleLogout}>
          <IoIosLogOut className="mr-2" /> Log Out
        </MenuItem>
      </Menu>
    </header>
  );
};

export default Header;
