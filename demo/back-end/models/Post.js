import mongoose from 'mongoose';

export const postSchema = new mongoose.Schema({
  caption: String,
  PostImage: String,
  createdAt: { type: Date, default: Date.now }
});
// export const Post = mongoose.model('Post', postSchema);
