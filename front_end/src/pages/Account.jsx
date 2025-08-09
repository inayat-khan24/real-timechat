import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MdEdit } from "react-icons/md";
import { handleError, handleSuccess } from '../component/notifiction';
import { ToastContainer } from 'react-toastify';

const Account = ({ userDetails, userInfo, editedData, setEditedData }) => {
  const [editingField, setEditingField] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
const Base_url = "https://real-timechat-l7bv.onrender.com"
  useEffect(() => {
    userDetails(); // fetch user info on mount
  }, []);

  const handleEdit = (field) => {
    setEditingField(field);
  };

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
        `${Base_url}/api/auth/updateprofile/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      handleSuccess("Profile updated successfully!");
      setEditingField(null);
      setSelectedFile(null);
      setPreviewImage(null);
      userDetails();
    } catch (err) {
      console.error("Update failed", err);
      handleError("Something went wrong while updating the profile!");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const profileImage = previewImage
    ? previewImage
    : userInfo?.profilePic
    ? `${userInfo.profilePic}`
    : "https://ui-avatars.com/api/?name=" + (userInfo.username || "User");

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-2xl rounded-xl">
      <div className="flex items-center gap-6 mb-10">
        <img
          src={profileImage}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 shadow-lg"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{userInfo.username}</h2>
          <label className="text-sm text-blue-600 cursor-pointer mt-2 inline-block font-medium hover:underline">
            Change Profile Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Field Component */}
        {[
          { label: "Name", field: "name" },
          { label: "Username", field: "username" },
          { label: "Email", field: "email" },
          { label: "Bio", field: "bios", isTextarea: true }
        ].map(({ label, field, isTextarea }) => (
          <div key={field} className="flex items-start gap-4">
            <label className="w-28 text-right pt-2 text-gray-700 font-semibold">{label}</label>
            <div className="flex-1">
              {editingField === field ? (
                isTextarea ? (
                  <textarea
                    name={field}
                    value={editedData[field]}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                ) : (
                  <input
                    type="text"
                    name={field}
                    value={editedData[field]}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                )
              ) : (
                <p className="text-gray-800">{userInfo[field] || "Not set"}</p>
              )}
            </div>
            <MdEdit
              onClick={() => handleEdit(field)}
              className="text-gray-500 hover:text-blue-600 cursor-pointer mt-2 text-lg"
              title={`Edit ${label}`}
            />
          </div>
        ))}

        {/* Save Changes Button */}
        {(editingField || selectedFile) && (
          <div className="text-right mt-6">
            <button
              onClick={handleUpdate}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md shadow-md"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Account;
