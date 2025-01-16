// controllers/taskController.js
const Task = require('../models/taskAssignModels');

const taskController = {
    // Assign a new task
    createTask: async (req, res) => {
        console.log("req.body",req.body)
        try {
            const { user, title, description, status, date } = req.body;
            
            const newTask = await Task.create({
                createdBy: req.user._id, // Assuming you have authentication middleware
                user,
                title,
                description,
                status: status || 'pending',
                date,
            });

            // await newTask.populate(['user', 'createdBy']);
            
            res.status(201).json({
                success: true,
                data: newTask
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    // Get tasks assigned to a specific user
    getUserTasks: async (req, res) => {
        try {
            const tasks = await Task.find({ user: req.params.userId })
                // .populate(['user', 'createdBy'])
                // .sort('-createdAt');

            res.status(200).json({
                success: true,
                count: tasks.length,
                data: tasks
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    // Get all tasks (with optional filters)
    getAllTasks: async (req, res) => {
        console.log("getAllTasks Controller Called")
        try {
            const { status } = req.query;
            const filter = {};
            
            if (status) {
                filter.status = status;
            }

            let tasks;

            if(req.user.role === "superAdmin" || req.user.role === "admin"){
                tasks = await Task.find(filter)
                    .populate(['user', 'createdBy'])
                    .sort({'createdAt': -1});
            }else{
                tasks = await Task.find({user: req.user._id, ...filter})
                .populate(['user', 'createdBy'])

                    
                    .sort({'createdAt': -1});
            }
            console.log("Tasks in controller:", tasks)
            res.status(200).json({
                success: true,
                count: tasks.length,
                data: tasks
            });
        } catch (error) {
            console.log(error)
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    // Update a task
    updateTask: async (req, res) => {
        try {
            const { title, description, status } = req.body;
            const taskId = req.params.taskId;

            const task = await Task.findById(taskId);
            
            if (!task) {
                return res.status(404).json({
                    success: false,
                    error: 'Task not found'
                });
            }

            // Optional: Check if user has permission to update
            // if (task.createdBy.toString() !== req.user._id.toString()) {
            //     return res.status(403).json({
            //         success: false,
            //         error: 'Not authorized to update this task'
            //     });
            // }

            const updatedTask = await Task.findByIdAndUpdate(
                taskId,
                { title, description, status },
                { new: true, runValidators: true }
            )
            // .populate(['user', 'createdBy']);

            res.status(200).json({
                success: true,
                data: updatedTask
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    // Delete a task
    deleteTask: async (req, res) => {
        try {
            const task = await Task.findByIdAndDelete(req.params.taskId);

            if (!task) {
                return res.status(404).json({
                    success: false,
                    error: 'Task not found'
                });
            }

            // Optional: Check if user has permission to delete
            // if (task.createdBy.toString() !== req.user._id.toString()) {
            //     return res.status(403).json({
            //         success: false,
            //         error: 'Not authorized to delete this task'
            //     });
            // }

            res.status(200).json({
                success: true,
                data: {}
            });
        } catch (error) {
            console.log("error", error)
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
};

module.exports = taskController;