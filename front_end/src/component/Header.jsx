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
  const [loadingSearch, setLoadingSearch] = useState(false); // 🔹 search loader state

  const [postModalOpen, setPostModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [uploadingPost, setUploadingPost] = useState(false); // 🔹 post upload loader

  const open = Boolean(anchorEl);
  const searchRef = useRef(null);
  const userNAme = localStorage.getItem("username");

  const profile = profilePic
    ? `${profilePic}`
    : 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3';

  const fetchSearch = async () => {
    try {
      setLoadingSearch(true); // loader start
      const res = await fetch("http://localhost:5000/api/auth/search");
      const result = await res.json();
      setUserSearch(result.users || []);
    } catch (error) {
      console.error("Search fetch failed", error);
    } finally {
      setLoadingSearch(false); // loader end
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
      setUploadingPost(true); // loader start
      const res = await fetch("http://localhost:5000/api/posts/create", {
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
      setUploadingPost(false); // loader end
    }
  };

  return (
    <>
      <header className="bg-white w-full border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-black text-[1rem]">
              <ImHome className="text-xl" />
            </Link>

            <Link to="/private" className="flex items-center gap-2 text-gray-700 hover:text-black text-[1rem]">
              <AiOutlineMessage className="text-xl" />
              <span>Messages</span>
            </Link>

            {/* user post image */}
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

            {/* Search */}
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
                    {loadingSearch ? (
                      <div className="flex justify-center py-4">
                        <CircularProgress size={20} />
                      </div>
                    ) : searchTerm.trim() ? (
                      filteredUsers.length > 0 ? (
                        filteredUsers.map((u, i) => (
                          <Link to={`/${u.username}`} key={i}
                            className="flex items-center gap-3 px-3 py-2 bg-yellow-100 hover:bg-yellow-200 rounded-md cursor-pointer text-sm text-gray-800 transition-all duration-150 shadow-sm"
                          >
                            <img
                              src={`${u.profilePic}`}
                              alt={u.username}
                              className="w-7 h-7 object-cover rounded-full border"
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
                <span className="text-sm text-gray-800 font-semibold">{userNAme}</span>
              </div>
            </Link>

            <Button onClick={handleClick} className="!text-gray-800 !normal-case">Menu</Button>

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
              <Link to="/account"><MenuItem onClick={handleClose}><MdAccountCircle className="mr-2" /> Account</MenuItem></Link>
              <Link to="/register"><MenuItem onClick={handleClose}><MdAccountCircle className="mr-2" /> Sign Up</MenuItem></Link>
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
              <div className='w-[100px] h-[100px] mb-15'>
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="preview"
                  className="w-full object-cover rounded-lg"
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
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitPost}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm flex items-center gap-2"
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
