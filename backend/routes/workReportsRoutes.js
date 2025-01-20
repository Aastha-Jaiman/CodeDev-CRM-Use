// routes/workReportRoutes.js
const express = require('express');
const router = express.Router();
const { jwtToken } = require('../middleware/auth');
const checkAdmin = require('../middleware/checkAdmin');
const {
  createWorkReport,
  updateWorkReport,
  getUserWorkReports,
  getAllWorkReports
} = require('../controller/workReportController');

// Protected routes (require authentication)
router.use(jwtToken);

// User routes
router.post('/create', createWorkReport);
router.put('/update/:id', updateWorkReport);
router.get('/user-reports', getUserWorkReports);

// Admin only route
router.get('/all-reports', checkAdmin, getAllWorkReports);

module.exports = router;