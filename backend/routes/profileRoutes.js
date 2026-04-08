const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");

router.post("/student-profile", profileController.saveOrUpdateProfile);
router.get("/student-profile/:studentId", profileController.getProfileByStudentId);
router.get("/student-profile-exists/:userEmail", profileController.checkProfileExists);

module.exports = router;
