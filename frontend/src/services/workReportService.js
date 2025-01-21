// src/services/workReportService.js

import api from './api';  // Importing the existing api.js file

const workReportService = {
  // Create a work report
  createWorkReport: async (data) => {
    try {
      // Only task, date, and state are required for creating a work report
      const response = await api.post('/workreports/create', {
        task: data.task,
        date: data.date,
        state: data.state,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating work report:', error);
      throw error;
    }
  },

  // Update a work report
  updateWorkReport: async (id, data) => {
    try {
      const response = await api.put(`/workreports/update/${id}`, data);  // Use the existing PUT method from api.js
      return response.data;
    } catch (error) {
      console.error('Error updating work report:', error);
      throw error;
    }
  },

  // Get user-specific work reports
  getUserWorkReports: async () => {
    try {
      const response = await api.get('/workreports/user-reports');  // Use the existing GET method from api.js
      return response.data;
    } catch (error) {
      console.error('Error fetching user reports:', error);
      throw error;
    }
  },

  // Get all work reports (admin-only route)
  getAllWorkReports: async () => {
    try {
      const response = await api.get('/workreport/all-reports');  // Use the existing GET method from api.js
      return response.data;
    } catch (error) {
      console.error('Error fetching all work reports:', error);
      throw error;
    }
  }
};

export default workReportService;


