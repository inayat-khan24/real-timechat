// import { User } from "../models/User.js";


// export const getUserFollowersWithStatus = async (req, res) => {
//   try {
//     const { targetUserId } = req.params; // profile jiska dekh rahe
//     const { loginUserId } = req.query;   // jo login hai
//     console.log(targetUserId )
//     console.log(loginUserId)

//     if (
//       !targetUserId||
//       !loginUserId
//     ) {
//       return res.status(400).json({ error: "Invalid ID format" });
//     }

//     // 1. Get login user following list
//     const loginUser = await User.findById(loginUserId);
//     const loginUserFollowingIds = loginUser.following.map(f => f.userId.toString());

//     // 2. Get target user's followers (already have username/profilePic inside)
//     const targetUser = await User.findById(targetUserId);

//     if (!targetUser) {
//       return res.status(404).json({ message: "Target user not found." });
//     }

//     // 3. Add isFollowing to each follower
//     const followersWithStatus = targetUser.followers.map(f => {
//       const isFollowing = loginUserFollowingIds.includes(f.userId.toString());
//       return {
//         _id: f.userId,
//         username: f.username,
//         profilePic: f.profilePic,
//         isFollowing,
//       };
//     });

//     res.status(200).json(followersWithStatus);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
