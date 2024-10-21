const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const authToken = require('../middleware/authToken');

router.get('/posts', postController.renderPostsPage); 
router.get('/api/posts', authToken, postController.getAllPosts);

router.get('/post/:id', postController.renderPostPage);
router.get('/api/post/:id', authToken, postController.getPost);

router.post('/api/post/:postId/comment', authToken, commentController.addComment);

module.exports = router;