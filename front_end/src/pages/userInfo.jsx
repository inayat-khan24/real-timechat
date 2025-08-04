import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const UserInfo = () => {
  const [loading, setLoading] = useState(true);
  const [otherUserinfo, setOtherUserinfo] = useState({});
  const [followed, setFollowed] = useState(false);
  const { anotherUserID } = useParams();
  const currentUserId = localStorage.getItem("userId");
 

  // Fetch other user's profile
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/auth/getOtherUserDetails/${anotherUserID}`);
        const data = await res.json();

        const userData = data[0] || {};
        setOtherUserinfo(userData);

        const isFollowing = (userData.followers || []).some(
          (f) => f.userId?.toString() === currentUserId
        );
        setFollowed(isFollowing);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch user details:', err);
      }
    };

    fetchUserDetails();
  }, [anotherUserID, currentUserId]);

  const {
    profilePic,
    _id,
    username = '',
    posts = [],
    bios = '',
    name = '',
    followers = [],
    following = [],
  } = otherUserinfo;

  const profile = profilePic
    ? `http://localhost:5000/uploads/${profilePic}`
    : 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3';

  const handleFollowToggle = async () => {
    const endpoint = followed
      ? "http://localhost:5000/api/auth/unfollow"
      : "http://localhost:5000/api/auth/follow";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentUserId,
          targetUserId: _id,
        }),
      });

      const contentType = res.headers.get("content-type");
      if (!res.ok || !contentType?.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Unexpected response: ${text}`);
      }

      const result = await res.json();
      if (res.ok) {
        setFollowed(!followed);
        // Refresh user info
        const updated = await fetch(`http://localhost:5000/api/auth/getOtherUserDetails/${anotherUserID}`);
        const updatedData = await updated.json();
        setOtherUserinfo(updatedData[0] || {});
      } else {
        alert(result.message || 'Something went wrong');
      }
    } catch (error) {
      console.error("Follow/Unfollow Error", error);
    }
  };

  if (loading) return <div className="text-center py-10 text-lg font-semibold">Loading user profile...</div>;
 localStorage.setItem("anotherUser",_id)
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Top Profile Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b pb-6">
        <img
          src={profile}
          alt="Profile"
          className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-gray-300 shadow"
        />
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-2xl font-semibold">{username}</h2>
            {currentUserId !== anotherUserID && (
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
            )}
          </div>

          <div className="flex gap-8 text-sm text-gray-700 mb-3">
            <span><strong>{posts.length}</strong> posts</span>
            <Link to={`/${anotherUserID}/followers`}>
            <span><strong>{followers.length}</strong> followers</span>
            </Link>
            <Link to={`/${anotherUserID }/following`}>
            <span><strong>{following.length}</strong> following</span>
            </Link>
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
