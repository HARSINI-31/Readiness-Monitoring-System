const User = require("../models/User");
const ExamReadiness = require("../models/ExamReadiness");
const PlacementReadiness = require("../models/PlacementReadiness");
const StudentProfile = require("../models/StudentProfile");
const ContactMessage = require("../models/ContactMessage");

// Get All Assessments
exports.getAllAssessments = async (req, res) => {
  try {
    const examResults = await ExamReadiness.find().lean().sort({ createdAt: -1 });
    const placementResults = await PlacementReadiness.find().lean().sort({ createdAt: -1 });

    const enrichedExamResults = examResults.map(exam => {
      let avgInternalMarks = 0;
      let avgAssignmentCompletion = 0;
      let avgAttendance = exam.attendance || 0;
      let avgStudyHours = exam.studyHours || 0;

      if (exam.subjects && exam.subjects.length > 0) {
        const total = exam.subjects.length;
        avgInternalMarks = exam.subjects.reduce((sum, s) => sum + Number(s.internalMarks || 0), 0) / total;
        avgAssignmentCompletion = exam.subjects.reduce((sum, s) => sum + Number(s.assignmentCompletion || 0), 0) / total;
        avgAttendance = exam.subjects.reduce((sum, s) => sum + Number(s.attendance || 0), 0) / total;
        avgStudyHours = exam.subjects.reduce((sum, s) => sum + Number(s.studyHours || 0), 0) / total;
      }

      return {
        ...exam,
        avgInternalMarks: Math.round(avgInternalMarks),
        avgAssignmentCompletion: Math.round(avgAssignmentCompletion),
        avgAttendance: Math.round(avgAttendance),
        avgStudyHours: Math.round(avgStudyHours),
        subjectDetails: exam.subjects 
      };
    });

    res.json({
      exam: enrichedExamResults,
      placement: placementResults,
      totalStudents: new Set([
        ...enrichedExamResults.map(r => r.userEmail),
        ...placementResults.map(r => r.userEmail)
      ]).size
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Exam Results
exports.getAllExamResults = async (req, res) => {
  try {
    const results = await ExamReadiness.find().sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Placement Results
exports.getAllPlacementResults = async (req, res) => {
  try {
    const results = await PlacementReadiness.find().sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" });
    const profiles = await StudentProfile.find();
    
    const combinedStudents = students.map(student => {
      const profile = profiles.find(p => p.userEmail === student.email);
      return {
        _id: student._id,
        name: profile?.name || student.name,
        email: student.email,
        role: student.role,
        studentId: profile?.studentId || "N/A",
        phone: profile?.phone || "N/A",
        department: profile?.department || "N/A",
        yearOfStudy: profile?.yearOfStudy || "N/A",
        registeredDate: student._id.getTimestamp()
      };
    });
    
    res.json(combinedStudents);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Student
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }
    await User.findByIdAndDelete(id);
    await StudentProfile.findOneAndDelete({ userEmail: user.email });
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
