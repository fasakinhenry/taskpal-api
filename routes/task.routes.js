const express = require('express');
const TaskController = require('../controllers/task.controller');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, TaskController.createTask);
router.get('/', TaskController.listTasks);
router.get('/:id', TaskController.getTask);
router.post('/:id/accept', authMiddleware, TaskController.acceptTask);
router.post('/:id/complete', authMiddleware, TaskController.completeTask);
router.post('/:id/pay', authMiddleware, TaskController.payTask);
router.put('/:id', authMiddleware, TaskController.updateTask);
router.delete('/:id', authMiddleware, TaskController.deleteTask);

module.exports = router;
