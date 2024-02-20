const express = require('express');
const controllers = require('../controllers ')
const blogRouter = express.Router();  
const blogController = controllers.blogController;

blogRouter.post('/', blogController.createBlog); // Create a new blog post
blogRouter.get('/', blogController.getAllBlogs); // Get all blog posts
blogRouter.get('/:id', blogController.getBlogById); // Get a single blog post by ID
blogRouter.put('/:id', blogController.updateBlogById); // Update a blog post by ID
blogRouter.delete('/:id', blogController.deleteBlogById); // Delete a blog post by ID

module.exports = blogRouter