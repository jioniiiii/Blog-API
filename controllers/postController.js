const Post = require('../models/post');

//render 
exports.renderPostsPage = (req, res) => {
    res.render('posts', { title: 'All Posts' });  
};

//GET all posts
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).populate('author', 'username');
        if(req.user.role === 'user' || req.user.isGeust) {
            const publishedPost = posts.filter(post => post.published === true);
            res.status(200).json(publishedPost);
        } else {
            res.status(200).json(posts);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error: error.message });
    }
};

//render
exports.renderPostPage = (req, res) => {
    res.render('post', { title: req.params.title });  
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
        res.status(200).json({
            post: post,
            user: req.user  
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching post', error: error.message });
    }
};

//render edit 
exports.renderEditPost = async (req, res) => {
    res.render('admin-edit', { title: req.params.title });
}

//PUT edit post
exports.editPost = async (req, res) => {
    const { title, body, published } = req.body; 

    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { 
                title: title, 
                body: body,
                published: published
            },
            { new: true, runValidators: true } 
        );

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json({ message: 'Post updated successfully', post: updatedPost });
    } catch (error) {
        console.error('Error editing post:', error);
        res.status(500).json({ message: 'Error editing post', error: error.message });
    }
};
