import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';

const Followers = () => {
  const [followers, setFollowers] = useState([]);
  const [otherUserinfo, setOtherUserinfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [username, setUserName] = useState('');
  const { anotherUserID } = useParams();

  const currentUserId = localStorage.getItem('userId');
  const targetUserId = localStorage.getItem('anotherUser');

  const userFollowersFetch = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/${targetUserId}/followers?currentUserId=${currentUserId}`
      );
      const data = await res.json();
      setFollowers(data.followers || []);
      setUserName(data.username || '');
      setLoading(false);
    } catch (error) {
      console.log('Error fetching followers:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    userFollowersFetch();
    
  }, [targetUserId, currentUserId]);

  const handleFollowToggle = async (followerId, isCurrentlyFollowing, targetId) => {
    const endpoint = isCurrentlyFollowing
      ? 'http://localhost:5000/api/auth/unfollow'
      : 'http://localhost:5000/api/auth/follow';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentUserId,
          targetUserId: targetId,
        }),
      });

      if (!res.ok) throw new Error('Something went wrong');

      const updated = await fetch(
        `http://localhost:5000/api/auth/${targetUserId}/followers?currentUserId=${currentUserId}`
      );
      const updatedData = await updated.json();
      setFollowers(updatedData.followers || []);
    } catch (error) {
      console.error('Follow/Unfollow Error', error);
    }
  };
useEffect(()=>{
  userFollowersFetch();
 
},[])

  if (loading) {
    return (
      <div className="text-center py-10 text-lg font-semibold">
        Loading user profile...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 font-sans">
      <h2 className="text-2xl text-center font-semibold mb-2">
        {anotherUserID  || 'User'} Followers
      </h2>

      <div className="flex gap-4 items-center justify-center mb-4">
        <NavLink
          to={`/${anotherUserID}/followers`}
          className={({ isActive }) =>
            `text-lg font-medium px-4 py-2 rounded-md transition ${
              isActive
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-black'
            }`
          }
        >
         {followers.length} Followers
        </NavLink>

        <NavLink
          to={`/${anotherUserID}/following`}
          className={({ isActive }) =>
            `text-lg font-medium px-4 py-2 rounded-md transition ${
              isActive
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-black'
            }`
          }
        >
          Following
        </NavLink>
      </div>

      {followers.length === 0 ? (
        <p className="text-gray-500 text-center">No followers yet.</p>
      ) : (
        <div className="space-y-4">
          {followers.map((follower) => (
            <div
              key={follower.userId}
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
                </div>
              </div>

              {currentUserId !== follower.userId.toString() && (
                <button
                  onClick={() =>
                    handleFollowToggle(
                      follower.userId,
                      follower.isFollow,
                      follower.userId
                    )
                  }
                  className={`px-5 py-1 text-sm rounded-full transition font-medium ${
                    follower.isFollow
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {follower.isFollow ? 'Unfollow' : 'Follow'}
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
