const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
  createdAt: { type: Date, default: Date.now },
  username: { type: String, required: true }
  // You can add more fields like replies, likes, etc. as needed
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;