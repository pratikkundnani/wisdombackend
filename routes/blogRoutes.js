const express = require('express');
const controllers = require('../controllers ')
const blogRouter = express.Router();  
const blogController = controllers.blogController;
const jwt = require('jsonwebtoken');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

function verifyToken (req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    jwt.verify(token, 'secret_key', (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      req.userId = decoded.userId;
      next();
    });
}


blogRouter.post('/', upload.single('image'), verifyToken, blogController.createBlog); // Create a new blog post
blogRouter.get('/download/image/:id', blogController.downloadImage); // Download an image
blogRouter.get('/', blogController.getAllBlogs); // Get all blog posts
blogRouter.get('/user/:username', blogController.getAllBlogsByUser); // Get all blog posts by a user
blogRouter.get('/:id',blogController.getBlogById); // Get a single blog post by ID
blogRouter.put('/:id', verifyToken, blogController.updateBlogById); // Update a blog post by ID
blogRouter.delete('/:id', verifyToken, blogController.deleteBlogById); // Delete a blog post by ID

module.exports = blogRouter