const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

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
  classBatch: String,
  department: String,
  semester: String,
  profileCreatedAt: { type: Date, default: Date.now },
  profileUpdatedAt: { type: Date, default: Date.now }
});

const StudentProfile = mongoose.model("StudentProfile", studentProfileSchema);

// ================= Exam Readiness Schema =================
const examReadinessSchema = new mongoose.Schema({
  studentId: String,
  userEmail: String,
  studentName: String,
  internalAssignments: Number,
  assignmentCompletion: Number,
  attendance: Number,
  unitTestMarks: Number,
  midSemExam: Number,
  overall: Number,
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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const PlacementReadiness = mongoose.model("PlacementReadiness", placementReadinessSchema);

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
    const { userId, userEmail, studentId, name, email, phone, classBatch, department, semester } = req.body;

    // Validation
    if (!studentId || !name || !email || !classBatch || !department || !semester) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingProfile = await StudentProfile.findOne({ studentId });

    if (existingProfile) {
      // Update existing profile
      existingProfile.name = name;
      existingProfile.email = email;
      existingProfile.phone = phone;
      existingProfile.classBatch = classBatch;
      existingProfile.department = department;
      existingProfile.semester = semester;
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
        classBatch,
        department,
        semester
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
      overall: Math.round(overall)
    });

    await assessment.save();

    res.json({
      message: "Assessment saved successfully",
      codingScore: Math.round(codingScore),
      aptitudeScore: Math.round(aptitudeScore),
      communicationScore: Math.round(communicationScore),
      attendanceScore: Math.round(attendanceScore),
      overall: Math.round(overall)
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
      internalAssignments,
      assignmentCompletion,
      attendance,
      unitTestMarks,
      midSemExam
    } = req.body;

    // Weighted calculation
    const overall =
      Number(internalAssignments) * 0.2 +
      Number(assignmentCompletion) * 0.15 +
      Number(attendance) * 0.15 +
      Number(unitTestMarks) * 0.25 +
      Number(midSemExam) * 0.25;

    // Save to database
    const assessment = new ExamReadiness({
      studentId,
      userEmail: studentEmail,
      studentName,
      internalAssignments: Number(internalAssignments),
      assignmentCompletion: Number(assignmentCompletion),
      attendance: Number(attendance),
      unitTestMarks: Number(unitTestMarks),
      midSemExam: Number(midSemExam),
      overall: Math.round(overall)
    });

    await assessment.save();

    res.json({
      message: "Assessment saved successfully",
      internalAssignments: Math.round(internalAssignments),
      assignmentCompletion: Math.round(assignmentCompletion),
      attendance: Math.round(attendance),
      unitTestMarks: Math.round(unitTestMarks),
      midSemExam: Math.round(midSemExam),
      overall: Math.round(overall)
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
    const examResults = await ExamReadiness.find().sort({ createdAt: -1 });
    const placementResults = await PlacementReadiness.find().sort({ createdAt: -1 });

    res.json({
      exam: examResults,
      placement: placementResults,
      totalStudents: new Set([
        ...examResults.map(r => r.userEmail),
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
    res.json(students);
  } catch (error) {
    console.error(error);
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
