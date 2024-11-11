const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const authToken = require('../middleware/authToken');

//posts
router.get('/posts', postController.renderPostsPage); 
router.get('/api/posts', authToken, postController.getAllPosts);

//post
router.get('/post/:id', postController.renderPostPage);
router.get('/api/post/:id', authToken, postController.getPost);

//comments
router.post('/api/post/:postId/comment', authToken, commentController.addComment);
router.delete('/api/post/:postId/comment/:commentId/delete', authToken, commentController.deleteComment);
router.put('/api/post/:postId/comment/:commentId/edit', authToken, commentController.editComment);

//admin-edit
router.get('/post/:id/edit', postController.renderEditPost);
router.put('/api/post/:id/edit', authToken, postController.editPost);//add admin protection for all that

module.exports = router;