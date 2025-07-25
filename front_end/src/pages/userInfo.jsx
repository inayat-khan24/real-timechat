import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const UserInfo = () => {
  const [loading, setLoading] = useState(true);
  const [otherUserinfo, setOtherUserinfo] = useState({});
  const [followed, setFollowed] = useState(false); // new state for follow/unfollow
  const { anotherUserID } = useParams();

  useEffect(() => {
    const anotherUserIDFetch = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/auth/getOtherUserDetails/${anotherUserID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await res.json();
        console.log(data)
        setOtherUserinfo(data[0] || {}); 
        setLoading(false)
      } catch (err) {
        console.error('Failed to fetch user details', err);
      } 
    };

    anotherUserIDFetch();
  }, [anotherUserID]);

  const {
    profilePic,
    username = '',
    posts = [],
    bios = '',
    name = '',
    followers,following
  } = otherUserinfo;

  const profile = profilePic
    ? `http://localhost:5000/uploads/${profilePic}`
    : 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3';

  const handleFollowToggle = () => {
    // Dummy toggle function — replace with API call later
    setFollowed((prev) => !prev);
  };

  if (loading) return <div className="text-center py-10 text-lg font-semibold">Loading user profile...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Top Profile Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b pb-6">
        {/* Profile Image */}
        <img
          src={profile}
          alt="Profile"
          className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-gray-300 shadow"
        />

        {/* User Info */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-2xl font-semibold">{username}</h2>
            <button
              onClick={handleFollowToggle}
              className={`px-5 py-2 text-sm font-medium rounded-md transition ${
                followed
                  ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {followed ? 'Unfollow' : 'Follow'}
            </button>
          </div>

          <div className="flex gap-8 text-sm text-gray-700 mb-3">
            <span><strong>{posts.length}</strong> posts</span>
            <span><strong>{followers.length}</strong> followers</span>
            <span><strong>{following.length}</strong> following</span>
          </div>

          <div className="mt-2 text-sm leading-relaxed">
            <p className="font-semibold">{name}</p>
            <p className="text-gray-600">{bios}</p>
          </div>
        </div>
      </div>

      {/* Posts Gallery */}
      <div className="mt-8">
        {posts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {posts.map((src, idx) => (
              <div key={idx} className="group overflow-hidden rounded-lg shadow hover:shadow-md transition">
                <img
                  src={`http://localhost:5000/postUploads/${src.PostImage}`}
                  alt={`Post ${idx + 1}`}
                  className="w-full aspect-square object-cover group-hover:opacity-90 transition"
                />
                <div className="bg-white px-2 py-1">
                  <p className="text-sm font-semibold truncate">{username}</p>
                  <p className="text-xs text-gray-600 truncate">{src.caption}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-sm mt-6">No posts to show yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
