const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  img: {type: String},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
  likes : [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

blogSchema.pre('remove', async function(next) {
  try {
    // Custom logic to delete associated blogs
    await Comment.deleteMany({ _id: { $in: this.comments } });
    next();
  } catch (error) {
    next(error);
  }
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;