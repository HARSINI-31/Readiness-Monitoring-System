const mongoose = require("mongoose");

const placementReadinessSchema = new mongoose.Schema({
  studentId: String,
  userEmail: String,
  studentName: String,
  codingAssessment: Number,
  problemsSolved: Number,
  mockAptitude: Number,
  logicalScore: Number,
  mockInterview: Number,
  gdScore: Number,
  sessionParticipation: Number,
  workshopAttendance: Number,
  codingScore: Number,
  aptitudeScore: Number,
  communicationScore: Number,
  attendanceScore: Number,
  overall: Number,
  status: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PlacementReadiness", placementReadinessSchema);
