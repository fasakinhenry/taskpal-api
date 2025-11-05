const express = require('express');
const AuthController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/me', AuthController.me);

module.exports = router;
