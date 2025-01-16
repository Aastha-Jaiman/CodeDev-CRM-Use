// services/TaskService.js
import api from './api';

const TaskService = {
    // Base URL for all task endpoints
    baseURL: '/taskRoutes',

    // Create a new task
    createTask: async (taskData) => {
        try {
            console.log("Admin task create service called!")
            const response = await api.post(TaskService.baseURL, taskData);
            return response.data;
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    },

    // Get all tasks with optional filters
    getAllTasks: async (filters = {}) => {
        try {
            console.log("fetched all task called")
            const queryString = new URLSearchParams(filters).toString();
            const url = queryString ? `${TaskService.baseURL}?${queryString}` : TaskService.baseURL;
            const response = await api.get(url);
            return response.data;
        } catch (error) {
            console.error('Error getting tasks:', error);
            throw error;
        }
    },

    // Get tasks for a specific user
    getUserTasks: async (userId) => {
        try {
            const response = await api.get(`${TaskService.baseURL}/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error getting user tasks:', error);
            throw error;
        }
    },

    // Update a task
    updateTask: async (taskId, updateData) => {
        try {
            const response = await api.put(`${TaskService.baseURL}/${taskId}`, updateData);
            return response.data;
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    },

    // Delete a task
    deleteTask: async (taskId) => {
        try {
            const response = await api.delete(`${TaskService.baseURL}/${taskId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    }
};

export default TaskService;