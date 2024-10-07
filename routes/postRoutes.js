const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');

router.get('/posts', postController.renderPostsPage);
router.get('/api/posts', postController.getAllPosts);

router.get('/post/:id', postController.renderPostPage);
router.get('/api/post/:id', postController.getPost);

router.post('/api/post/:postId/comment', commentController.addComment);

router.get('/test', (req, res) => {
    res.send('Test route works');
});

module.exports = router;