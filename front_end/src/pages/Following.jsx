import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';

const Following = () => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUserName] = useState("");
 
  const currentUserId = localStorage.getItem("userId");
    const anotherUserID  = localStorage.getItem("anotherUser");
const userName = useParams()
  const userFollowersFetch = async () => {
    const fetchh = `http://localhost:5000/api/auth/user/686f784c6499604edff68a29/followers-with-status?loginUserId=688358dd2d52ef039d7213b6`
    try {
      const res = await fetch(`http://localhost:5000/api/auth/${anotherUserID? anotherUserID :currentUserId }/follow-data`);
      const data = await res.json();
     console.log
      const userData = data.following  || {};

      setUserName(userData.username);

      // Add isFollowing flag to each follower
      const followersWithStatus = (userData || []).map(f => ({
        ...f,
        isFollowing: f.userId?.toString() === currentUserId // ✅ Only one definition
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
  }, []);

  // Toggle follow/unfollow (just local state update for now)
  const handleFollowToggle = (userId, isFollowing) => {
    setFollowers(prev =>
      prev.map(f =>
        f._id === userId ? { ...f, isFollowing: !isFollowing } : f
      )
    );
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
    `text-lg font-medium px-4 py-2 rounded-md transition ${
      isActive ? 'text-black border-b-2 border-black' : 'text-gray-500 hover:text-black'
    }`
  }
>
  Followers
</NavLink>

<NavLink
  to={`/${userName.anotherUserID}/following`}
  className={({ isActive }) =>
    `text-lg font-medium px-4 py-2 rounded-md transition ${
      isActive ? 'text-black border-b-2 border-black' : 'text-gray-500 hover:text-black'
    }`
  }
>
  Following
</NavLink>


      </div>

      {followers.length === 0 ? (
        <p className="text-gray-500 text-center">No following yet.</p>
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

              {/* Show Follow/Unfollow if this follower is not the current user */}
              {currentUserId !== follower._id && (
                <button
                  onClick={() => handleFollowToggle(follower._id, follower.isFollowing)}
                  className={`px-5 py-1 text-sm rounded-full transition font-medium ${
                    !follower.isFollowing
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {!follower.isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Following;
