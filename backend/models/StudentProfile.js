const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  userEmail: String,
  studentId: { type: String, unique: true },
  name: String,
  email: String,
  phone: String,
  department: String,
  yearOfStudy: String,
  profileCreatedAt: { type: Date, default: Date.now },
  profileUpdatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("StudentProfile", studentProfileSchema);
