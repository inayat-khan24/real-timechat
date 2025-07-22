import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MdEdit } from "react-icons/md";

const Account = ({ userDetails, userInfo, editedData, setEditedData }) => {
  const [editingField, setEditingField] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    userDetails();
  }, []);

  const handleEdit = (field) => setEditingField(field);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editedData.name);
      formData.append("username", editedData.username);
      formData.append("email", editedData.email);
      formData.append("bios", editedData.bios);

      if (selectedFile) {
        formData.append("profilePic", selectedFile);
      }

      await axios.put(
        `http://localhost:5000/api/auth/updateprofile/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
      setSelectedFile(file);
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
    <div className="max-w-2xl mx-auto p-6">
      {/* Profile Pic + Edit Button */}
      <div className="flex items-center gap-6 mb-8">
        <img
          src={profileImage}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border"
        />
        <div>
          <h2 className="font-semibold text-lg">{userInfo.username}</h2>
          <label className="text-sm font-medium text-blue-500 cursor-pointer">
            Change Profile Photo
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Name */}
        <div className="flex items-start gap-4">
          <label className="w-24 text-right pt-2 text-sm text-gray-700">Name</label>
          <div className="flex-1">
            {editingField === "name" ? (
              <input
                type="text"
                name="name"
                value={editedData.name}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:ring focus:outline-none"
              />
            ) : (
              <p className="text-sm">{userInfo.name}</p>
            )}
          </div>
          <MdEdit onClick={() => handleEdit("name")} className="text-gray-500 cursor-pointer mt-2" />
        </div>

        {/* Username */}
        <div className="flex items-start gap-4">
          <label className="w-24 text-right pt-2 text-sm text-gray-700">Username</label>
          <div className="flex-1">
            {editingField === "username" ? (
              <input
                type="text"
                name="username"
                value={editedData.username}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:ring focus:outline-none"
              />
            ) : (
              <p className="text-sm">{userInfo.username}</p>
            )}
          </div>
          <MdEdit onClick={() => handleEdit("username")} className="text-gray-500 cursor-pointer mt-2" />
        </div>

        {/* Email */}
        <div className="flex items-start gap-4">
          <label className="w-24 text-right pt-2 text-sm text-gray-700">Email</label>
          <div className="flex-1">
            {editingField === "email" ? (
              <input
                type="email"
                name="email"
                value={editedData.email}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:ring focus:outline-none"
              />
            ) : (
              <p className="text-sm">{userInfo.email}</p>
            )}
          </div>
          <MdEdit onClick={() => handleEdit("email")} className="text-gray-500 cursor-pointer mt-2" />
        </div>

        {/* Bios */}
<div className="flex items-start gap-4">
  <label className="w-24 text-right pt-2 text-sm text-gray-700">Bio</label>
  <div className="flex-1">
    {editingField === "bios" ? (
      <textarea
        name="bios"
        value={editedData.bios}
        onChange={handleChange}
        rows={3}
        className="w-full border px-3 py-2 rounded focus:ring focus:outline-none resize-none"
      />
    ) : (
      <p className="text-sm whitespace-pre-wrap">{userInfo.bios || "No bio added."}</p>
    )}
  </div>
  <MdEdit onClick={() => handleEdit("bios")} className="text-gray-500 cursor-pointer mt-2" />
</div>


        {/* Save Button */}
        {(editingField || selectedFile) && (
          <div className="pl-24">
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
