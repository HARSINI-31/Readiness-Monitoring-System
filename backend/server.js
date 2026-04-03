const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ================= MongoDB Connection =================
mongoose.connect("mongodb://127.0.0.1:27017/readinessDB")
  .then(() => console.log(" MongoDB Connected"))
  .catch((err) => console.log(" DB Error:", err));

// ================= User Schema =================
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["student", "admin"] }
});

const User = mongoose.model("User", userSchema);

// ================= Student Profile Schema =================
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

const StudentProfile = mongoose.model("StudentProfile", studentProfileSchema);

// ================= Exam Readiness Schema =================
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

const ExamReadiness = mongoose.model("ExamReadiness", examReadinessSchema);

// ================= Placement Readiness Schema =================
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

const PlacementReadiness = mongoose.model("PlacementReadiness", placementReadinessSchema);

// ================= Contact Message Schema =================
const contactMessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);

// ================= Create Admin Function =================
const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);

      const admin = new User({
        name: "Main Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "admin"
      });

      await admin.save();
      console.log(" Default Admin Created");
    } else {
      console.log("ℹ Admin Already Exists");
    }
  } catch (error) {
    console.log("Admin creation error:", error);
  }
};

// ================= ROUTES - ALL DEFINED BEFORE SERVER START =================

// Health Check Endpoint
app.get("/health", (req, res) => {
  res.json({ status: "Server is running", db: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected" });
});

// ================= Signup API =================
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "student"   // Signup only for students
    });

    await newUser.save();

    res.status(201).json({ message: "Signup successful" });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ================= Login API =================
app.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email, role });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      role: user.role,
      userId: user._id,
      userName: user.name,
      userEmail: user.email
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ================= Student Profile APIs =================
// Save or Update Student Profile
app.post("/student-profile", async (req, res) => {
  try {
    const { userId, userEmail, studentId, name, email, phone, department, yearOfStudy } = req.body;

    // Validation
    if (!studentId || !name || !email || !department || !yearOfStudy) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingProfile = await StudentProfile.findOne({ studentId });

    if (existingProfile) {
      // Update existing profile
      existingProfile.name = name;
      existingProfile.email = email;
      existingProfile.phone = phone;
      existingProfile.department = department;
      existingProfile.yearOfStudy = yearOfStudy;
      existingProfile.profileUpdatedAt = new Date();
      await existingProfile.save();
      res.json({ message: "Profile updated successfully", profile: existingProfile });
    } else {
      // Create new profile
      const profile = new StudentProfile({
        userId,
        userEmail,
        studentId,
        name,
        email,
        phone,
        department,
        yearOfStudy
      });
      await profile.save();
      res.json({ message: "Profile created successfully", profile });
    }
  } catch (error) {
    console.error("Profile save error:", error.message);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).json({ message: `${field} already exists. Please use a different ${field}.` });
    } else {
      res.status(500).json({ message: error.message || "Error saving profile" });
    }
  }
});

// Get Student Profile by Student ID
app.get("/student-profile/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const profile = await StudentProfile.findOne({ studentId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Check if Student Profile exists
app.get("/student-profile-exists/:userEmail", async (req, res) => {
  try {
    const { userEmail } = req.params;
    const profile = await StudentProfile.findOne({ userEmail });

    res.json({ exists: !!profile, profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ================= Placement Readiness Calculation API =================
app.post("/calculate", async (req, res) => {
  try {
    const {
      studentId,
      studentEmail,
      studentName,
      codingAssessment,
      problemsSolved,
      mockAptitude,
      logicalScore,
      mockInterview,
      gdScore,
      sessionParticipation,
      workshopAttendance
    } = req.body;

    const codingScore = (Number(codingAssessment) + Number(problemsSolved)) / 2;
    const aptitudeScore = (Number(mockAptitude) + Number(logicalScore)) / 2;
    const communicationScore = (Number(mockInterview) + Number(gdScore)) / 2;
    const attendanceScore = (Number(sessionParticipation) + Number(workshopAttendance)) / 2;

    const overall = codingScore * 0.3 + aptitudeScore * 0.25 + communicationScore * 0.25 + attendanceScore * 0.2;
    const overallScore = Math.round(overall);
    let status = "Not Ready";
    if (overallScore >= 80) {
      status = "Ready";
    } else if (overallScore >= 60) {
      status = "Moderately Ready";
    }

    // Save to database
    const assessment = new PlacementReadiness({
      studentId,
      userEmail: studentEmail,
      studentName,
      codingAssessment: Number(codingAssessment),
      problemsSolved: Number(problemsSolved),
      mockAptitude: Number(mockAptitude),
      logicalScore: Number(logicalScore),
      mockInterview: Number(mockInterview),
      gdScore: Number(gdScore),
      sessionParticipation: Number(sessionParticipation),
      workshopAttendance: Number(workshopAttendance),
      codingScore: Math.round(codingScore),
      aptitudeScore: Math.round(aptitudeScore),
      communicationScore: Math.round(communicationScore),
      attendanceScore: Math.round(attendanceScore),
      overall: overallScore,
      status: status
    });

    await assessment.save();

    res.json({
      message: "Assessment saved successfully",
      codingScore: Math.round(codingScore),
      aptitudeScore: Math.round(aptitudeScore),
      communicationScore: Math.round(communicationScore),
      attendanceScore: Math.round(attendanceScore),
      overall: overallScore,
      status: status
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ================= Exam Readiness Calculation API =================
app.post("/exam-calculate", async (req, res) => {
  try {
    const {
      studentId,
      studentEmail,
      studentName,
      department,
      subjects
    } = req.body;

    // Calculate average scores across all subjects
    const totalSubjects = subjects.length;
    const avgInternalMarks = subjects.reduce((sum, subj) => sum + Number(subj.internalMarks), 0) / totalSubjects;
    const avgAssignmentCompletion = subjects.reduce((sum, subj) => sum + Number(subj.assignmentCompletion), 0) / totalSubjects;
    const avgAttendance = subjects.reduce((sum, subj) => sum + Number(subj.attendance), 0) / totalSubjects;
    const avgStudyHours = subjects.reduce((sum, subj) => sum + Number(subj.studyHours), 0) / totalSubjects;

    // New weighted calculation with normalized study hours
    // Study hours are on a 0-10 scale, normalize to percentage (0-100)
    const normalizedStudyHours = (avgStudyHours / 10) * 100;

    const overall =
      avgInternalMarks * 0.30 +           // 30% - Internal marks
      avgAssignmentCompletion * 0.25 +    // 25% - Assignment completion
      avgAttendance * 0.25 +              // 25% - Attendance
      normalizedStudyHours * 0.20;        // 20% - Study hours (normalized)

    const overallScore = Math.round(overall);
    let status = "Not Ready";
    if (overallScore >= 80) {
      status = "Ready";
    } else if (overallScore >= 60) {
      status = "Moderately Ready";
    }

    // Save to database
    const assessment = new ExamReadiness({
      studentId,
      userEmail: studentEmail,
      studentName,
      department,
      subjects: subjects.map(subj => ({
        code: subj.code,
        name: subj.name,
        internalMarks: Number(subj.internalMarks),
        assignmentCompletion: Number(subj.assignmentCompletion),
        attendance: Number(subj.attendance),
        studyHours: Number(subj.studyHours)
      })),
      attendance: Number(avgAttendance),
      studyHours: Number(avgStudyHours),
      overall: overallScore,
      status: status
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
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ================= Get Student's Own Results =================
app.get("/my-results/:studentEmail", async (req, res) => {
  try {
    const { studentEmail } = req.params;

    const examResults = await ExamReadiness.findOne({ userEmail: studentEmail }).sort({ createdAt: -1 });
    const placementResults = await PlacementReadiness.findOne({ userEmail: studentEmail }).sort({ createdAt: -1 });

    res.json({
      exam: examResults || null,
      placement: placementResults || null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ================= Get All Exam Attempts for a Student =================
app.get("/my-exam-attempts/:studentEmail", async (req, res) => {
  try {
    const { studentEmail } = req.params;

    const examAttempts = await ExamReadiness.find({ userEmail: studentEmail }).sort({ createdAt: -1 });

    res.json(examAttempts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ================= Get All Placement Attempts for a Student =================
app.get("/my-placement-attempts/:studentEmail", async (req, res) => {
  try {
    const { studentEmail } = req.params;

    const placementAttempts = await PlacementReadiness.find({ userEmail: studentEmail }).sort({ createdAt: -1 });

    res.json(placementAttempts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ================= Get All Assessments for Admin =================
app.get("/all-assessments", async (req, res) => {
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
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ================= Get All Students (for Admin Dashboard) =================
app.get("/students", async (req, res) => {
  try {
    const students = await User.find({ role: "student" });
    const profiles = await StudentProfile.find();
    
    // Combine student account info with profile info
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
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ================= Delete Student (for Admin Dashboard) =================
app.delete("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the user to get their email before deleting
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    // Delete their user account
    await User.findByIdAndDelete(id);
    
    // Also delete their profile if it exists (using email as reference per schema)
    await StudentProfile.findOneAndDelete({ userEmail: user.email });
    
    // Optional: We could also delete their readiness records, but we'll leave them for now or as needed
    
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ================= Contact Message APIs =================
// Handle OPTIONS request for CORS
app.options("/api/contact", (req, res) => {
  res.status(200).end();
});

// POST /api/contact - Save contact message
app.post("/api/contact", async (req, res) => {
  console.log("Received contact message request");
  console.log("Request body:", req.body);
  console.log("Request headers:", req.headers);

  try {
    const { name, email, subject, message } = req.body;

    console.log("Extracted data:", { name, email, subject, message });

    // Validation
    if (!name || !email || !subject || !message) {
      console.log("Validation failed - missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    const contactMessage = new ContactMessage({
      name,
      email,
      subject,
      message
    });

    await contactMessage.save();
    console.log("Contact message saved successfully");

    res.status(201).json({ message: "Message stored successfully" });
  } catch (error) {
    console.error("Contact message save error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET /api/contact - Get all contact messages
app.get("/api/contact", async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error("Contact messages fetch error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ================= START SERVER =================
// Wait for MongoDB to connect, then start the server
mongoose.connection.once("open", async () => {
  await createAdmin();

  app.listen(5000, () => {
    console.log("✅ Server running on port 5000");
  });
});

// Handle MongoDB connection errors
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
