Blog = require("../models/Blog");

const blogController = {
    // Create a new blog post
    async createBlog(req, res) {
      try {
        const { title, content, userId, tags, img } = req.body;
        const newBlog = new Blog({
          title,
          content,
          userId,
          tags, img
        });
        await newBlog.save();
        res.status(201).json({ message: 'Blog post created successfully', blog: newBlog });
      } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },
  
    // Get all blog posts
    getAllBlogs: async (req, res) => {
      try {
        console.log("Getting blog posts");
        const blogs = await Blog.find().populate('userId', 'username').populate('comments').populate('likes');
        console.log(blogs);
        res.status(200).json(blogs);
      } catch (error) {
        console.error('', error);
        res.status(500).json({error: 'Error getting blog posts' });
      }
    },
  
    // Get a single blog post by ID
    getBlogById: async (req, res) => {
      try {
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId).populate('userId', 'username').populate('comments').populate('likes');
        if (!blog) {
          return res.status(404).json({ message: 'Blog post not found' });
        }
        res.status(200).json(blog);
      } catch (error) {
        console.error('Error getting blog post by ID:', error);
        res.status(500).json({ error: 'Error getting blog post by ID:'});
      }
    },
  
    // Update a blog post by ID
    updateBlogById: async (req, res) => {
      try {
        const blogId = req.params.id;
        const { title, content, tags } = req.body;
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, { title, content, tags, updatedAt: Date.now() }, { new: true });
        if (!updatedBlog) {
          return res.status(404).json({ message: 'Blog post not found' });
        }
        res.status(200).json({ message: 'Blog post updated successfully', blog: updatedBlog });
      } catch (error) {
        console.error('Error updating blog post by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },
  
    // Delete a blog post by ID
    deleteBlogById: async (req, res) => {
      try {
        const blogId = req.params.id;
        const deletedBlog = await Blog.findByIdAndDelete(blogId);
        if (!deletedBlog) {
          return res.status(404).json({ message: 'Blog post not found' });
        }
        res.status(200).json({ message: 'Blog post deleted successfully' });
      } catch (error) {
        console.error('Error deleting blog post by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
};
  


module.exports = blogController;
