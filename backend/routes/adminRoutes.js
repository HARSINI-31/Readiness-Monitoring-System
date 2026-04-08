const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/all-assessments", adminController.getAllAssessments);
router.get("/all-exam-results", adminController.getAllExamResults);
router.get("/all-placement-results", adminController.getAllPlacementResults);
router.get("/students", adminController.getAllStudents);
router.delete("/students/:id", adminController.deleteStudent);

module.exports = router;
