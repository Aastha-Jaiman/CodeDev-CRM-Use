// models/workReport.js
const mongoose = require("mongoose");

const workReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: false
  },
  scheduledOn: {
    type: Date,
    required: true
  },
  conclusion: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  }
}, { timestamps: true });

const WorkReport = mongoose.model("WorkReport", workReportSchema);
module.exports = WorkReport;