const Post = require('../models/post');

//render 
exports.renderPostsPage = (req, res) => {
    res.render('posts', { title: 'All Posts', user: req.user });  
};

//GET all posts
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).populate('author', 'username');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error: error.message });
    }
};

//render
exports.renderPostPage = (req, res) => {
    res.render('post', { title: req.params.title , user: req.user });  
};

//GET post
exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author', 
                    select: 'username' ,
                    body: 'text',
                }
            }); 
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching post', error: error.message });
    }
};
