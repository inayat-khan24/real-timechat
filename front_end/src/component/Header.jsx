import React, { useEffect, useState, useRef } from 'react';
import { Button, Menu, MenuItem, CircularProgress } from '@mui/material';
import { IoIosLogOut } from 'react-icons/io';
import { MdAccountCircle } from 'react-icons/md';
import { AiOutlineMessage } from 'react-icons/ai';
import { IoCameraOutline, IoSearch } from "react-icons/io5";
import { ImHome } from "react-icons/im";
import { Link, useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from './notifiction';

const Header = ({ userDetails, profilePic, setUser, user }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearch, setUserSearch] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const [postModalOpen, setPostModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [uploadingPost, setUploadingPost] = useState(false);
  const open = Boolean(anchorEl);
  const searchRef = useRef(null);
  const userNAme = localStorage.getItem("username");
  const Base_url = "https://real-timechat-l7bv.onrender.com"
  
  const profile = profilePic
    ? `${profilePic}`
    : 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3';

  const fetchSearch = async () => {
    try {
      setLoadingSearch(true);
      const res = await fetch(`${Base_url}/api/auth/search`);
      const result = await res.json();
      setUserSearch(result.users || []);
    } catch (error) {
      console.error("Search fetch failed", error);
    } finally {
      setLoadingSearch(false);
    }
  };

  const filteredUsers = userSearch.filter((u) =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    userDetails();
    fetchSearch();

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
    setSelectedImage(file);
    setPostModalOpen(true);
  };

  const handleSubmitPost = async () => {
    if (!selectedImage || !caption) return alert("Image and caption required");

    const formData = new FormData();
    formData.append("PostImage", selectedImage);
    formData.append("userId", localStorage.getItem("userId"));
    formData.append("caption", caption);

    try {
      setUploadingPost(true);
      const res = await fetch(`${Base_url}/api/posts/create`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      handleSuccess("Post uploaded successfully");
      setSelectedImage(null);
      setCaption("");
      setPostModalOpen(false);
    } catch (err) {
      console.error("Post error", err);
      handleError("Failed to upload post");
    } finally {
      setUploadingPost(false);
    }
  };

  return (
    <>
      <header className="bg-white w-full border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          {/* Logo/Brand (can be replaced with an image) */}
          <Link to="/" className="text-2xl font-bold text-gray-800 hidden md:block">
            ChatApp
          </Link>

          {/* Center: Navigation & Search */}
          <div className="flex-1 flex justify-center items-center gap-4 md:gap-6">
            
            {/* Nav Icons */}
            <nav className="flex items-center gap-4 md:gap-6">
              <Link to="/" className="nav-icon">
                <ImHome className="text-2xl" />
                <span className="hidden md:inline">Home</span>
              </Link>
              <Link to="/private" className="nav-icon">
                <AiOutlineMessage className="text-2xl" />
                <span className="hidden md:inline">Messages</span>
              </Link>
              <label htmlFor="fileInput" className="nav-icon cursor-pointer">
                <IoCameraOutline className="text-2xl" />
                <span className="hidden md:inline">Post</span>
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  onChange={handleProfilePost}
                  className="hidden"
                />
              </label>
            </nav>

            {/* Search */}
            <div className="relative hidden sm:block" ref={searchRef}>
              <button
                onClick={() => setSearchOpen((prev) => !prev)}
                className="text-2xl text-gray-600 hover:text-black focus:outline-none"
              >
                <IoSearch />
              </button>

              {searchOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-14 w-80 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-2xl p-4 z-50 animate-fade-in-down">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="🔍 Search users..."
                    className="w-full border border-gray-300 focus:border-blue-500 transition-all duration-200 px-4 py-2 rounded-lg text-sm mb-3 outline-none placeholder-gray-500"
                    autoFocus
                  />

                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {loadingSearch ? (
                      <div className="flex justify-center py-4">
                        <CircularProgress size={20} />
                      </div>
                    ) : searchTerm.trim() ? (
                      filteredUsers.length > 0 ? (
                        filteredUsers.map((u, i) => (
                          <Link to={`/${u.username}`} key={i}
                            className="flex items-center gap-3 px-3 py-2 bg-yellow-50 hover:bg-yellow-100 rounded-md cursor-pointer text-sm text-gray-800 transition-all duration-150 shadow-sm"
                            onClick={() => setSearchOpen(false)}
                          >
                            <img
                              src={u.profilePic || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d'}
                              alt={u.username}
                              className="w-8 h-8 object-cover rounded-full border"
                            />
                            <span className="font-medium">{u.username}</span>
                          </Link>
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

            {/* Mobile Search Icon */}
            <button
              onClick={() => setSearchOpen((prev) => !prev)}
              className="text-2xl text-gray-600 hover:text-black sm:hidden focus:outline-none"
            >
              <IoSearch />
            </button>
          </div>

          {/* Right: User Profile & Menu */}
          <div className="flex items-center gap-3">
            <Link to="/profile">
              <div className="flex items-center gap-2">
                <img
                  src={profile}
                  alt="User"
                  className="w-10 h-10 object-cover rounded-full border-2 border-transparent hover:border-blue-500 transition-colors"
                />
              </div>
            </Link>

            <Button onClick={handleClick} className="!text-gray-800 !normal-case !font-semibold !p-2 !rounded-full !min-w-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              slotProps={{
                paper: { elevation: 1, sx: { mt: 1.5, minWidth: 180 } },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Link to="/account" className="no-underline text-inherit"><MenuItem onClick={handleClose}><MdAccountCircle className="mr-2" /> Account</MenuItem></Link>
              <Link to="/register" className="no-underline text-inherit"><MenuItem onClick={handleClose}><MdAccountCircle className="mr-2" /> Sign Up</MenuItem></Link>
              <MenuItem onClick={handleLogout}><IoIosLogOut className="mr-2" /> Log Out</MenuItem>
            </Menu>
          </div>
        </div>
      </header>

      {/* 📦 Post Modal */}
      {postModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md relative space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Create Post</h2>

            {selectedImage && (
              <div className='w-full h-48 overflow-hidden rounded-lg border-2 border-gray-200'>
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <textarea
              rows={3}
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:border-blue-500"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPostModalOpen(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitPost}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm flex items-center gap-2 transition-colors"
                disabled={uploadingPost}
              >
                {uploadingPost && <CircularProgress size={14} color="inherit" />}
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;