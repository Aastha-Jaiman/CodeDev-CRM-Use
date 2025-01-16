// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const taskAssignController = require('../controller/taskAssignController');
const { jwtToken } = require('../middleware/auth'); // Assuming you have auth middleware
const checkAdmin  = require('../middleware/checkAdmin'); 
// All routes are protected with authentication
router.use(jwtToken);

// Create a new task
router.post('/',checkAdmin, taskAssignController.createTask);

// Get all tasks with optional status filter
router.get('/', taskAssignController.getAllTasks);

// Get tasks for a specific user
router.get('/user/:userId', taskAssignController.getUserTasks);

// Update a task
router.put('/:taskId',checkAdmin, taskAssignController.updateTask);

// Delete a task
router.delete('/:taskId',checkAdmin, taskAssignController.deleteTask);

module.exports = router;