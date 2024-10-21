const Comment = require('../models/comment');
const Post = require('../models/post');

exports.addComment = async (req, res) => {
    try {
        const { postId } = req.params
        const { text } = req.body;
        
        const comment = new Comment({
            post: postId,
            text: text,
            author: req.user._id
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