const express = require('express');
const controllers = require('../controllers ')
const commentController = controllers.commentController;
const commentRouter = express.Router();  
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const secret_key =  'secret_key'
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    jwt.verify(token, secret_key, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        req.userId = decoded.userId;
        next();
    });
}

// Create a new comment for blog with :id
commentRouter.post('/', verifyToken, commentController.createComment);

// Get all comments for a blog
commentRouter.get('/blog/:id', commentController.getAllCommentsForABlog);

commentRouter.get('/', commentController.getComment);

commentRouter.delete('/:id', verifyToken, commentController.deleteComment);

module.exports = commentRouter;