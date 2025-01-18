const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    "title": "WorkReport",
    "type": "object",
    "properties": {
      "task_data": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "description": "A list of tasks included in the report."
      },
      "feedback_summary": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "feedback": {
              "type": "string",
              "description": "A summary of the feedback provided."
            },
            "is_positive": {
              "type": "boolean",
              "description": "Indicates whether the feedback is positive (True) or negative (False)."
            }
          },
          "required": ["feedback", "is_positive"]
        },
        "description": "A list of feedback summaries for the tasks."
      },
      "is_completed": {
        "type": "boolean",
        "description": "Indicates whether the work report is complete."
      }
    },
    "required": ["task_data", "feedback_summary", "is_completed"]
  }
)