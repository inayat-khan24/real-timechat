import React, { use, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const Profile = ({profilePic,userDetails,userInfo}) => {
const [loading,setLoading] = useState(true)

 const user = localStorage.getItem("username");
const {username,name,posts,bios
  , followers = [],
    following = []
} = userInfo

  useEffect(() => {
    localStorage.removeItem("anotherUser");
userDetails(); // fetch user details on mount
setLoading(false)
  }, []);

 const profile = profilePic
    ? `${profilePic}`
    : 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3';

//   const profilePic = "https://i.pravatar.cc/150?img=5"; // or your uploaded one
//   const posts = new Array(3).fill("https://source.unsplash.com/random/300x300");
if(posts === undefined) return <div>Loading....</div>
  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Top Profile Section */}
      <div className="flex flex-col md:flex-row items-center gap-8 border-b pb-6">
        {/* Profile Image */}
        <img
          src={profile}
          alt="Profile"
          className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border"
        />

        {/* User Info */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <h2 className="text-xl font-semibold">{username}</h2>
            <Link to="/account">
            <button className="px-4 py-1 text-sm font-medium border rounded-md hover:bg-gray-100">
              Edit Profile
            </button>
            </Link>
          </div>

         <div className="flex gap-8 text-sm text-gray-700 mb-3">
                       <span><strong>{posts.length}</strong> posts</span>
                       <Link to={`/${user}/followers`}>
                       <span><strong>{followers.length}</strong> followers</span>
                       </Link>
                       <Link to={`/${user}/following`}>
                       <span><strong>{following.length}</strong> following</span>
                       </Link>
                     </div>

          <div className="mt-2 text-sm">
            <p className="font-semibold">{name}</p>
            <p className="text-gray-600">{bios}</p>
          </div>
        </div>
      </div>

      {/* Posts Gallery */}
     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
  {posts.map((src, idx) => (
    <div key={idx} className="w-full">
      <img
        src={`http://localhost:5000/postUploads/${src.PostImage}`}
        alt={`Post ${idx + 1}`}
        className="w-full aspect-square object-cover hover:opacity-80 cursor-pointer rounded-md"
      />
      <div className='flex items-center gap-2 mt-2 px-1'>
        <span className='font-bold'>{username}</span>
        <span className="truncate">{src.caption}</span>
      </div>
    </div>
  ))}
</div>


      
    </div>
  );
};

export default Profile;
