const express = require('express');

const router = express.Router();

// Get all tasks
router.get('/');
// Get a single task
router.get('/:id');
// Create a task
router.post('/');
// Accept a task
router.post('/:id/accept');
// Mark task as complete
router.post('/:id/complete');
// Mark task as paid
router.post('/:id/pay');
// Update task
router.put('/:id/');
// Delete task
router.delete('/:id/accept');


module.exports = router;
