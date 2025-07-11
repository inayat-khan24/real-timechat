import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IoIosLogOut } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { MdAccountCircle } from "react-icons/md";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLogin, setIsLogin] = useState(true); // For demo, assume true
    const navigate = useNavigate();

  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);


  const [name,setName] = useState("Guest")
 

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLogin(false);
    handleClose(); // Close menu after logout
     navigate('/login')
  };

const handleacoount =()=>{
handleClose();

}
  
  const [profilePic,setProfilePic] = useState()
 const userId = localStorage.getItem("userId");
 const userDetails = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/auth/getUserDetails?userId=${userId}`);
      const data = await res.json();
      
      setProfilePic(data.profilePic);
      setName(data.name)
    } catch (err) {
      console.error("Failed to fetch user details", err);
    }
  };

  useEffect(() => {
    userDetails();
  }, []);



  return (
    <header className="bg-amber-50 w-full flex max-lg:flex-col justify-around items-center border-b border-gray-200 shadow-sm">
      <Button
        className="flex items-center max-sm:w-full gap-2"
        onClick={handleClick}
      >
        <div className="!bg-[#f1f1f1] !rounded-full !h-10 !w-10 !min-w-10 flex items-center justify-center p-0">
          <img
            src={`http://localhost:5000/uploads/${profilePic}`}
            alt="user profile"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="sm:flex flex-col items-start text-xs">
          <span className="font-semibold capitalize text-black/70">
            {name}
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
        <Link to="/account" >
        <MenuItem onClick={handleacoount}>
          <MdAccountCircle className='mr-2' />  Account
        </MenuItem>
        </Link>
        <MenuItem onClick={handleLogout}>
          <IoIosLogOut className="mr-2" /> Log Out
        </MenuItem>
      </Menu>
    </header>
  );
};

export default Header;
