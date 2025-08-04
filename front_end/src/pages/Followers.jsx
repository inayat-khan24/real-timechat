import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';

const Followers = () => {
  const [followers, setFollowers] = useState([]);
  const [otherUserinfo, setOtherUserinfo] = useState({});
  console.log(followers);
  const [followed, setFollowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUserName] = useState("");
  const userName = useParams();

  const currentUserId = localStorage.getItem("userId");
  const anotherUserID = localStorage.getItem("anotherUser");

  const userFollowersFetch = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/auth/${anotherUserID ? anotherUserID : currentUserId}/follow-data`);
      const data = await res.json();
      console.log(data);
      const userData = data.followers || {};

      setUserName(data.username);

      const followersWithStatus = (userData || []).map(f => ({
        ...f,
        isFollowing: f.userId?.toString() === currentUserId
      }));

      setFollowers(followersWithStatus);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching followers:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    userFollowersFetch();
  }, [anotherUserID, currentUserId]);

  const handleFollowToggle = async (userId, isFollowing, id) => {
    console.log(isFollowing)
    const endpoint = isFollowing
      ? "http://localhost:5000/api/auth/unfollow"
      : "http://localhost:5000/api/auth/follow";

    setFollowers(prev =>
      prev.map(f =>
        f._id === userId ? { ...f, isFollowing: !isFollowing } : f
      )
    );

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentUserId,
          targetUserId: id,
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
        const updated = await fetch(`http://localhost:5000/api/auth/getOtherUserDetails/${anotherUserID}`);
        const updatedData = await updated.json();
        console.log(updatedData)
        setOtherUserinfo(updatedData[0] || {});
      } else {
        alert(result.message || 'Something went wrong');
      }
    } catch (error) {
      console.error("Follow/Unfollow Error", error);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-lg font-semibold">Loading user profile...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 font-sans">
      <h2 className="text-2xl text-center font-semibold mb-2">{userName.anotherUserID}</h2>

      <div className='flex gap-4 items-center justify-center '>
        <NavLink
          to={`/${userName.anotherUserID}/followers`}
          className={({ isActive }) =>
            `text-lg font-medium px-4 py-2 rounded-md transition ${isActive ? 'text-black border-b-2 border-black' : 'text-gray-500 hover:text-black'}`
          }
        >
          Followers
        </NavLink>

        <NavLink
          to={`/${userName.anotherUserID}/following`}
          className={({ isActive }) =>
            `text-lg font-medium px-4 py-2 rounded-md transition ${isActive ? 'text-black border-b-2 border-black' : 'text-gray-500 hover:text-black'}`
          }
        >
          Following
        </NavLink>
      </div>

      {followers.length === 0 ? (
        <p className="text-gray-500 text-center">No followers yet.</p>
      ) : (
        <div className="space-y-4">
          {followers.map(follower => (
            <div
              key={follower._id}
              className="flex items-center justify-between border-b pb-3"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    follower.profilePic
                      ? `http://localhost:5000/uploads/${follower.profilePic}`
                      : `https://ui-avatars.com/api/?name=${follower.username}`
                  }
                  alt="profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold">{follower.username}</p>
                  <p className="text-xs text-gray-500">{follower.name}</p>
                </div>
              </div>

              {currentUserId !== follower._id && (
                <button
                  onClick={() => handleFollowToggle(follower._id, follower.isFollowing, follower.userId?._id)}
                  className={`px-5 py-1 text-sm rounded-full transition font-medium ${
                    follower.isFollowing
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {follower.isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Followers;
