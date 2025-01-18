const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
    submitWorkReport,
    getTaskWorkReports,
    getUserWorkReports,
} = require("../controllers/workReportController");

// Submit work report
router.post("/submit", authMiddleware, submitWorkReport);

// Get work reports for a specific task
router.get("/task/:taskId", authMiddleware, getTaskWorkReports);

// Get user's submitted work reports
router.get("/user", authMiddleware, getUserWorkReports);

module.exports = router;