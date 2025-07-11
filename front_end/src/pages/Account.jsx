import React, { useEffect, useState } from 'react';

const Account = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    profilePic: ''
  });

  const [previewImage, setPreviewImage] = useState(null); // 👈 for selected file
  const userId = localStorage.getItem("userId");

  // Get user details from backend
  const userDetails = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/auth/getUserDetails?userId=${userId}`);
      const data = await res.json();
      setUserInfo(data);
    } catch (err) {
      console.error("Failed to fetch user details", err);
    }
  };

  useEffect(() => {
    userDetails();
  }, []);

  // ✅ Handle new file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setPreviewImage(imageURL); // 👈 store image preview
    }
  };

  // ✅ Determine which image to show
  const profileImage = previewImage
    ? previewImage
    : userInfo.profilePic
    ? `http://localhost:5000/uploads/${userInfo.profilePic}`
    : 'https://via.placeholder.com/100';

  return (
    <div className='bg-[#ebe7e7] w-[99%] h-screen ml-2 flex justify-center items-center'>
      <div className='w-[50%] bg-amber-100 p-6 rounded'>

        {/* Profile Section */}
        <section className="flex items-center space-x-6 border-b pb-4 mb-6">
          <img
            src={profileImage}
            className='w-24 h-24 rounded-full object-cover border'
            alt="Profile"
          />
          <div>
            <h2 className='font-bold text-2xl mb-2'>{userInfo.name || 'Your Name'}</h2>

            <label className="inline-block bg-blue-500 text-white px-4 py-1 rounded cursor-pointer hover:bg-blue-600 text-sm">
              Choose File
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </section>

        {/* // profile info  */}
        <section>
      <h2 className='font-bold mb-2'>Name : {userInfo.name || 'Your Name'}</h2>
      <h2 className='font-bold  mb-2'>username : {userInfo.username || 'Your Name'}</h2>
        </section>

      </div>
    </div>
  );
};

export default Account;