import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Followers = () => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUserName] = useState("");
  const { anotherUserID } = useParams();
  const currentUserId = localStorage.getItem("userId");

  const userFollowersFetch = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/auth/getOtherUserDetails/${anotherUserID}`);
      const data = await res.json();
      const userData = data[0] || {};

      setUserName(userData.username);

      // Add isFollowing flag to each follower
      const followersWithStatus = (userData.followers || []).map(f => ({
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
      <h2 className="text-2xl text-center font-semibold mb-2">{username}</h2>
      <h2 className="text-xl font-semibold mb-6 text-center">Followers</h2>

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
                  {!follower.isFollowing ? 'Unfollow' : 'Follow'}
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
