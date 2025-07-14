import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MdEdit } from "react-icons/md";

const Account = ({userDetails,userInfo,editedData,setEditedData}) => {


  const [editingField, setEditingField] = useState(null);
 
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // ✅ file storage

 
  const token = localStorage.getItem("token");
 const userId = localStorage.getItem("userId");


  useEffect(() => {
    userDetails();
  }, []);

  const handleEdit = (field) => {
    setEditingField(field);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Updated with FormData for image
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editedData.name);
      formData.append("username", editedData.username);
      formData.append("email", editedData.email);
      formData.append("profilePic", previewImage);

      if (selectedFile) {
        formData.append("profilePic", selectedFile); // ✅ Add file to form
      }

      const res = await axios.put(
        `http://localhost:5000/api/auth/updateprofile/${userId}`,
        formData,
        
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      alert("Profile updated successfully!");
      setEditingField(null);
      userDetails();
      setSelectedFile(null);
    } catch (err) {
      console.error("Update failed", err);
      alert("Something went wrong!");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // ✅ set actual file
      const imageURL = URL.createObjectURL(file);
      setPreviewImage(imageURL);
    }
  };

  const profileImage = previewImage
    ? previewImage
    : userInfo.profilePic
    ? `http://localhost:5000/uploads/${userInfo.profilePic}`
    : "https://via.placeholder.com/100";

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-5xl p-8 flex gap-8">

        {/* Left: Profile Picture */}
        <div className="w-1/3 text-center border-r pr-6">
          <img
            src={profileImage}
            alt="Profile"
            className="w-32 h-32 mx-auto rounded-full object-cover border border-gray-300"
          />
          <h2 className="mt-4 text-2xl font-semibold">{userInfo.name || "Your Name"}</h2>
          <label className="mt-2 inline-block bg-blue-600 text-white text-sm px-4 py-1.5 rounded cursor-pointer hover:bg-blue-700">
            Change Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Right: Profile Fields */}
        <div className="w-2/3 space-y-6">

          {/* Name */}
          <div className="flex justify-between items-center">
            <div className="w-full">
              <label className="text-gray-600 text-sm">Name</label>
              {editingField === "name" ? (
                <input
                  type="text"
                  name="name"
                  value={editedData.name}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              ) : (
                <p className="mt-1 text-lg">{userInfo.name}</p>
              )}
            </div>
            <MdEdit
              className="text-xl text-gray-600 cursor-pointer ml-3"
              onClick={() => handleEdit("name")}
            />
          </div>

          {/* Username */}
          <div className="flex justify-between items-center">
            <div className="w-full">
              <label className="text-gray-600 text-sm">Username</label>
              {editingField === "username" ? (
                <input
                  type="text"
                  name="username"
                  value={editedData.username}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              ) : (
                <p className="mt-1 text-lg">{userInfo.username}</p>
              )}
            </div>
            <MdEdit
              className="text-xl text-gray-600 cursor-pointer ml-3"
              onClick={() => handleEdit("username")}
            />
          </div>

          {/* Email */}
          <div className="flex justify-between items-center">
            <div className="w-full">
              <label className="text-gray-600 text-sm">Email</label>
              {editingField === "email" ? (
                <input
                  type="email"
                  name="email"
                  value={editedData.email}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              ) : (
                <p className="mt-1 text-lg">{userInfo.email}</p>
              )}
            </div>
            <MdEdit
              className="text-xl text-gray-600 cursor-pointer ml-3"
              onClick={() => handleEdit("email")}
            />
          </div>

          {/* Save Button */}
          {(editingField || selectedFile) && (
            <div className="text-right">
              <button
                onClick={handleUpdate}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                Save Changes
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Account;
