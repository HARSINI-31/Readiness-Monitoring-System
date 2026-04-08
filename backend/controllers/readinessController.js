const PlacementReadiness = require("../models/PlacementReadiness");
const ExamReadiness = require("../models/ExamReadiness");

// Placement Readiness Calculation API
exports.calculatePlacement = async (req, res) => {
  try {
    const {
      studentId, studentEmail, studentName, codingAssessment, problemsSolved,
      mockAptitude, logicalScore, mockInterview, gdScore, sessionParticipation, workshopAttendance
    } = req.body;

    const codingScore = (Number(codingAssessment) + Number(problemsSolved)) / 2;
    const aptitudeScore = (Number(mockAptitude) + Number(logicalScore)) / 2;
    const communicationScore = (Number(mockInterview) + Number(gdScore)) / 2;
    const attendanceScore = (Number(sessionParticipation) + Number(workshopAttendance)) / 2;

    const overall = codingScore * 0.3 + aptitudeScore * 0.25 + communicationScore * 0.25 + attendanceScore * 0.2;
    const overallScore = Math.round(overall);
    let status = "Not Ready";
    if (overallScore >= 80) status = "Ready";
    else if (overallScore >= 60) status = "Moderately Ready";

    const assessment = new PlacementReadiness({
      studentId, userEmail: studentEmail, studentName, codingAssessment: Number(codingAssessment),
      problemsSolved: Number(problemsSolved), mockAptitude: Number(mockAptitude), logicalScore: Number(logicalScore),
      mockInterview: Number(mockInterview), gdScore: Number(gdScore), sessionParticipation: Number(sessionParticipation),
      workshopAttendance: Number(workshopAttendance), codingScore: Math.round(codingScore),
      aptitudeScore: Math.round(aptitudeScore), communicationScore: Math.round(communicationScore),
      attendanceScore: Math.round(attendanceScore), overall: overallScore, status: status
    });

    await assessment.save();
    res.json({
      message: "Assessment saved successfully", codingScore: Math.round(codingScore),
      aptitudeScore: Math.round(aptitudeScore), communicationScore: Math.round(communicationScore),
      attendanceScore: Math.round(attendanceScore), overall: overallScore, status: status
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Exam Readiness Calculation API
exports.calculateExam = async (req, res) => {
  try {
    const { studentId, studentEmail, studentName, department, subjects } = req.body;

    const totalSubjects = subjects.length;
    const avgInternalMarks = subjects.reduce((sum, subj) => sum + Number(subj.internalMarks), 0) / totalSubjects;
    const avgAssignmentCompletion = subjects.reduce((sum, subj) => sum + Number(subj.assignmentCompletion), 0) / totalSubjects;
    const avgAttendance = subjects.reduce((sum, subj) => sum + Number(subj.attendance), 0) / totalSubjects;
    const avgStudyHours = subjects.reduce((sum, subj) => sum + Number(subj.studyHours), 0) / totalSubjects;

    const normalizedStudyHours = (avgStudyHours / 10) * 100;
    const overall = avgInternalMarks * 0.30 + avgAssignmentCompletion * 0.25 + avgAttendance * 0.25 + normalizedStudyHours * 0.20;
    const overallScore = Math.round(overall);

    let status = "Not Ready";
    if (overallScore >= 80) status = "Ready";
    else if (overallScore >= 60) status = "Moderately Ready";

    const assessment = new ExamReadiness({
      studentId, userEmail: studentEmail, studentName, department,
      subjects: subjects.map(subj => ({
        code: subj.code, name: subj.name, internalMarks: Number(subj.internalMarks),
        assignmentCompletion: Number(subj.assignmentCompletion), attendance: Number(subj.attendance),
        studyHours: Number(subj.studyHours)
      })),
      attendance: Number(avgAttendance), studyHours: Number(avgStudyHours),
      overall: overallScore, status: status
    });

    await assessment.save();
    res.json({
      message: "Assessment saved successfully",
      department,
      subjects: subjects.map(subj => ({
        code: subj.code,
        name: subj.name,
        internalMarks: Math.round(Number(subj.internalMarks)),
        assignmentCompletion: Math.round(Number(subj.assignmentCompletion)),
        attendance: Math.round(Number(subj.attendance)),
        studyHours: Number(subj.studyHours)
      })),
      attendance: Math.round(avgAttendance),
      studyHours: avgStudyHours,
      avgInternalMarks: Math.round(avgInternalMarks),
      avgAssignmentCompletion: Math.round(avgAssignmentCompletion),
      avgAttendance: Math.round(avgAttendance),
      avgStudyHours: Math.round(avgStudyHours),
      overall: overallScore,
      status: status
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get Student's Own Results
exports.getMyResults = async (req, res) => {
  try {
    const { studentEmail } = req.params;
    const examResults = await ExamReadiness.findOne({ userEmail: studentEmail }).sort({ createdAt: -1 });
    const placementResults = await PlacementReadiness.findOne({ userEmail: studentEmail }).sort({ createdAt: -1 });

    res.json({
      exam: examResults || null,
      placement: placementResults || null
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Exam Attempts for a Student
exports.getMyExamAttempts = async (req, res) => {
  try {
    const { studentEmail } = req.params;
    const examAttempts = await ExamReadiness.find({ userEmail: studentEmail }).sort({ createdAt: -1 });
    res.json(examAttempts);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Placement Attempts for a Student
exports.getMyPlacementAttempts = async (req, res) => {
  try {
    const { studentEmail } = req.params;
    const placementAttempts = await PlacementReadiness.find({ userEmail: studentEmail }).sort({ createdAt: -1 });
    res.json(placementAttempts);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
