const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/signup', authController.renderSignUp);
router.post('/api/signup', authController.signUp);

router.get('/login', authController.renderLogIn);
router.post('/api/login', authController.logIn);

module.exports = router;