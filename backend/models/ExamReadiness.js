const mongoose = require("mongoose");

const examReadinessSchema = new mongoose.Schema({
  studentId: String,
  userEmail: String,
  studentName: String,
  department: String,
  subjects: [{
    code: String,
    name: String,
    internalMarks: Number,
    assignmentCompletion: Number,
    attendance: Number,
    studyHours: Number
  }],
  attendance: Number,
  studyHours: Number,
  overall: Number,
  status: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ExamReadiness", examReadinessSchema);
