Comment = require('../models/Comment');
User = require('../models/User');
Blog = require('../models/Blog');
const commentController = {
    async createComment(req, res) {
        try {
            const {content, blogId, username} = req.body;
            const blog = await Blog.findById(blogId);
            if(!blog) {
                return res.status(404).json({message: 'Error while creating comment. Blog not found'});
            }
            const newComment = new Comment({content, blogId, username: username});
            await newComment.save();
            blog.comments.push(newComment);
            await blog.save();
            res.status(201).json({ message: 'comment created successfully', comment: newComment });
        }
         catch(error) {
            console.error('Error creating comment', error);
            res.status(500).json({ error: 'Internal server error' });
         }
    }, 
    async getAllCommentsForABlog(req, res) {
        try {
            const blogId = req.params.id;
            const comments = await Comment.find({blogId: blogId});
            return res.status(201).json(comments);
        } catch (error) {
            console.error('Error getting comments', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async getComment(req, res) {
        try {
            const {commentId} = req.params.id;
            const comment = await Comment.findById(commentId);
            return res.status(201).json(comment);
        } catch (error) {
            console.error('Error getting comments', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async deleteComment(req, res) {
        try {
            const {commentId} = req.body;
            const comment = await Comment.findByIdAndDelete(commentId);
            if(!comment) {
                return res.status(404).json({message: 'Comment not found'});
            }
            return res.status(201).json(comment);
        }
        catch(error) {
            return res.status(500).json({message: error.message});
        }
    }
}

module.exports = commentController;