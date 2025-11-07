const express = require('express');
const AuthController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', authMiddleware, AuthController.logout);
router.get('/me', authMiddleware, AuthController.me);

// google oauth placeholder
router.get('/google', AuthController.googleOAuthPlaceholder);

module.exports = router;
