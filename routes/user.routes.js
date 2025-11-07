const express = require('express');
const UserController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me/tasks', authMiddleware, UserController.myTasks);
router.get('/:id/tasks/posted', UserController.postedTasks);
router.get('/:id/tasks/accepted', UserController.acceptedTasks);
router.get('/:id', UserController.getUser);

module.exports = router;
