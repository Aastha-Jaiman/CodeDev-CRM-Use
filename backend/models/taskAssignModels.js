const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "inactive", "pending", "completed"],
        },
        date: {
            type: Date,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);
const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
