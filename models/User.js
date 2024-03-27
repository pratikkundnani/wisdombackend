const mongoose = require('mongoose');
const Blog = require('./Blog');
const Comment = require('./Comment');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  blogs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Blog'}],
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
  likedBlogs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Blog'}],
});

userSchema.pre('remove', async function(next) {
  try {
    // Custom logic to delete associated blogs
    await Blog.deleteMany({ _id: { $in: this.blogs } });
    await Comment.deleteMany({ _id: { $in: this.comments } });
    next();
  } catch (error) {
    next(error);
  }
});
const User = mongoose.model('User', userSchema);

module.exports = User;
