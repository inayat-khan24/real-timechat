import React, { useEffect, useState } from "react";
import axios from "axios";

const Feeds = () => {
  const [feedPosts, setFeedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(feedPosts)
const id = localStorage.getItem("userId")
  // Fetch feed on mount
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        

       const res = await axios.get(`http://localhost:5000/api/auth/feeds?userId=${id}`);

        setFeedPosts(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching feed:", err);
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-lg font-medium">Loading feed...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Your Feed</h2>

      {feedPosts.length === 0 ? (
        <p className="text-gray-600">No posts to show.</p>
      ) : (
        feedPosts.map((post) => (
          <div
            key={post._id}
            className="bg-white shadow-md rounded-lg p-4 mb-6 border border-gray-200"
          >
            <div className="flex items-center mb-3">
              <img
                src={`${post.userId.profilePic}`}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              
              <div>
                <h4 className="font-semibold text-gray-800">{post.userId.name}</h4>
                
              </div>
            </div>

            

            {post.PostImage && (
              <img
                  src={`http://localhost:5000/postUploads/${post.PostImage}`}
                  alt={`Post`}
                  className="w-full  aspect-square object-cover group-hover:opacity-90 transition"
                />
            )}
            <p className="text-gray-700 mb-3">{post.caption}</p>
            <p className="text-sm text-gray-400 mt-2">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default Feeds;
