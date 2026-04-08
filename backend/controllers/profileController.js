const StudentProfile = require("../models/StudentProfile");

// Save or Update Student Profile
exports.saveOrUpdateProfile = async (req, res) => {
  try {
    const { userId, userEmail, studentId, name, email, phone, department, yearOfStudy } = req.body;

    if (!studentId || !name || !email || !department || !yearOfStudy) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingProfile = await StudentProfile.findOne({ studentId });

    if (existingProfile) {
      existingProfile.name = name;
      existingProfile.email = email;
      existingProfile.phone = phone;
      existingProfile.department = department;
      existingProfile.yearOfStudy = yearOfStudy;
      existingProfile.profileUpdatedAt = new Date();
      await existingProfile.save();
      res.json({ message: "Profile updated successfully", profile: existingProfile });
    } else {
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
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).json({ message: `${field} already exists. Please use a different ${field}.` });
    } else {
      res.status(500).json({ message: error.message || "Error saving profile" });
    }
  }
};

// Get Student Profile by Student ID
exports.getProfileByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const profile = await StudentProfile.findOne({ studentId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Check if Student Profile exists
exports.checkProfileExists = async (req, res) => {
  try {
    const { userEmail } = req.params;
    const profile = await StudentProfile.findOne({ userEmail });
    res.json({ exists: !!profile, profile });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
