const mongoose = require('mongoose');
const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');

exports.addComment = async (req, res) => {
    try {
        const { postId } = req.params
        const { text } = req.body;
        const hardCodedUserId = new mongoose.Types.ObjectId('66fe84df03c01463b71c2f26');
        const comment = new Comment({
            post: postId,
            text: text,
            author: hardCodedUserId //hardcoded for now when auth is complete change!!
        });

        await comment.save();

        const post = await Post.findById(postId);
        post.comments.push(comment._id);
        await post.save();
        
        res.status(201).json(comment);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Failed to add comment' });
    }
};