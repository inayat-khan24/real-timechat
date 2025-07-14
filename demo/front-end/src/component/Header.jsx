import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IoIosLogOut } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { MdAccountCircle } from "react-icons/md";

const Header = ({userDetails,profilePic,name,setUser}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLogin, setIsLogin] = useState(true); // For demo, assume true
    const navigate = useNavigate();

  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const token = localStorage.getItem('token');

  
  
  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    setUser(token)
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
   
    handleClose(); // Close menu after logout
    ;
     navigate('/login')
  };

const handleacoount =()=>{
handleClose();

}
  



  useEffect(() => {
    userDetails();
  }, []);

const profile = profilePic ? `http://localhost:5000/uploads/${profilePic}` :
 "https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3"

  return (
    <header className="bg-amber-50 w-full flex max-lg:flex-col justify-around items-center border-b border-gray-200 shadow-sm">
   <div className='flex items-center gap-4'>

     <ul>
    <Link to="/private"> <li>Chat</li></Link> 
    </ul>
      <Button
        className="flex items-center max-sm:w-full gap-2"
        onClick={handleClick}
      >
        <div className="!bg-[#f1f1f1] !rounded-full !h-10 !w-10 !min-w-10 flex items-center justify-center p-0">
          <img
            src={profile}
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
   </div>

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
          <Link to="/register" >
        <MenuItem onClick={handleacoount}>
          <MdAccountCircle className='mr-2' />  sing up
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
