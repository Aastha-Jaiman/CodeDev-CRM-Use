const WorkReport = require("../models/workReportModels");
const Task = require("../models/taskAssignModels");

// Submit work report
const submitWorkReport = async (req, res) => {
    try {
        const { taskId, feedback, isCompleted } = req.body;

        // Check if task exists
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Create work report
        const workReport = new WorkReport({
            task: taskId,
            submittedBy: req.user._id,
            feedback,
            isCompleted,
        });

        await workReport.save();

        // If task is completed, update task status
        if (isCompleted) {
            task.status = "completed";
            await task.save();
        }

        res.status(201).json({
            success: true,
            message: "Work report submitted successfully",
            workReport,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error submitting work report",
            error: error.message,
        });
    }
};

// Get work reports for a specific task
const getTaskWorkReports = async (req, res) => {
    try {
        const { taskId } = req.params;
        const workReports = await WorkReport.find({ task: taskId })
            .populate("submittedBy", "name email")
            .populate("task");

        res.status(200).json({
            success: true,
            workReports,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching work reports",
            error: error.message,
        });
    }
};

// Get user's submitted work reports
const getUserWorkReports = async (req, res) => {
    try {
        const workReports = await WorkReport.find({ submittedBy: req.user._id })
            .populate("task")
            .sort({ submissionDate: -1 });

        res.status(200).json({
            success: true,
            workReports,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching user work reports",
            error: error.message,
        });
    }
};

module.exports = {
    submitWorkReport,
    getTaskWorkReports,
    getUserWorkReports,
};