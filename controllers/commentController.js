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

exports.deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment =  await Comment.findByIdAndDelete(commentId);
        
        if(!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        await Post.findByIdAndUpdate(
            comment.post,
            { $pull: { comments: commentId } },
        );

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Failed to delete comment' });
    }
};

exports.editComment = async (req, res) => {
    try {
        const { commentId } = req.params;   
        const { text } = req.body;          

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (req.user._id.toString() !== comment.author.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to edit this comment' });
        }

        comment.text = text;
        await comment.save();  

        res.status(200).json({ message: 'Comment edited successfully', comment });
    } catch (error) {
        console.error('Error editing comment:', error);
        res.status(500).json({ message: 'Failed to edit comment' });
    }
};