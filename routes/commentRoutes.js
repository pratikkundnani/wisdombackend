const express = require('express');
const controllers = require('../controllers ')
const commentController = controllers.commentController;
const commentRouter = express.Router();  

commentRouter.post('/', commentController.createComment);

// Get all comments for a blog
commentRouter.get('/blog/:id', commentController.getAllCommentsForABlog);

commentRouter.get('/:id', commentController.getComment);

commentRouter.delete('/:id', commentController.deleteComment);

module.exports = commentRouter;