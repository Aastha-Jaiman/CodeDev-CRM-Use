const WorkReport = require("../models/workReportModels");

const createWorkReport = async (req, res) => {
  try {
    const { task, date, state } = req.body;

    // Validate required fields for creating a task
    if (!task || !date || !state) {
      return res.status(400).json({
        success: false,
        message: "Task title, date, and status are required."
      });
    }

    // Create a new work report
    const workReport = await WorkReport.create({
      user: req.user._id, // Automatically associate with logged-in user
      title: task,
      scheduledOn: new Date(date),
      status: state
    });

    res.status(201).json({
      success: true,
      message: "Work report created successfully",
      data: workReport
    });
  } catch (error) {
    console.error("Error creating work report:", error);
    res.status(500).json({
      success: false,
      message: "Error creating work report",
      error: error.message
    });
  }
};

const updateWorkReport = async (req, res) => {
  try {
    const {task, scheduledOn, conclusion, state } = req.body;
    const reportId = req.params.id;

    const workReport = await WorkReport.findById(reportId);
    
    if (!workReport) {
      return res.status(404).json({
        success: false,
        message: "Work report not found"
      });
    }

    // Check if the user is the owner of the report
    if (workReport.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this work report"
      });
    }

    const updatedReport = await WorkReport.findByIdAndUpdate(
      reportId,
      {
        title:task,
        description:conclusion,
        scheduledOn: scheduledOn ? new Date(scheduledOn) : workReport.scheduledOn,
        status:state
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Work report updated successfully",
      data: updatedReport
    });
  } catch (error) {
    console.error("Error updating work report:", error);
    res.status(500).json({
      success: false,
      message: "Error updating work report",
      error: error.message
    });
  }
};

const getUserWorkReports = async (req, res) => {
  try {
    const workReports = await WorkReport.find({ user: req.user._id })
      .sort({ scheduledOn: -1 });

    res.status(200).json({
      success: true,
      message: "Work reports retrieved successfully",
      data: workReports
    });
  } catch (error) {
    console.error("Error fetching work reports:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching work reports",
      error: error.message
    });
  }
};

const getAllWorkReports = async (req, res) => {
  try {
    // This endpoint is for admin only (protected by middleware)
    const workReports = await WorkReport.find()
      .populate('user', 'name email')
      .sort({ scheduledOn: -1 });

    res.status(200).json({
      success: true,
      message: "All work reports retrieved successfully",
      data: workReports
    });
  } catch (error) {
    console.error("Error fetching all work reports:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching all work reports",
      error: error.message
    });
  }
};

module.exports = {
  createWorkReport,
  updateWorkReport,
  getUserWorkReports,
  getAllWorkReports
};



