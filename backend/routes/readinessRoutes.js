const express = require("express");
const router = express.Router();
const readinessController = require("../controllers/readinessController");

router.post("/calculate", readinessController.calculatePlacement);
router.post("/exam-calculate", readinessController.calculateExam);
router.get("/my-results/:studentEmail", readinessController.getMyResults);
router.get("/my-exam-attempts/:studentEmail", readinessController.getMyExamAttempts);
router.get("/my-placement-attempts/:studentEmail", readinessController.getMyPlacementAttempts);

module.exports = router;
