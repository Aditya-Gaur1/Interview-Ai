const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");

const interviewController = require("../controllers/interview.controller");

const upload = require("../middleware/file.middleware");

const interviewRouter = express.Router();

// ============================================================
// GENERATE INTERVIEW REPORT
// POST /api/interview/
// ============================================================

interviewRouter.post(
  "/",
  authMiddleware.authUser,
  upload.single("resume"),
  interviewController.generateInterviewReportController
);

// ============================================================
// GET ALL INTERVIEW REPORTS
// GET /api/interview/
// ============================================================

interviewRouter.get(
  "/",
  authMiddleware.authUser,
  interviewController.getAllInterviewReportsController
);

// ============================================================
// GET SINGLE INTERVIEW REPORT
// GET /api/interview/report/:interviewId
// ============================================================

interviewRouter.get(
  "/report/:interviewId",
  authMiddleware.authUser,
  interviewController.getInterviewReportByIdController
);

// ============================================================
// DELETE INTERVIEW REPORT
// DELETE /api/interview/report/:interviewId
// ============================================================

interviewRouter.delete(
  "/report/:interviewId",
  authMiddleware.authUser,
  interviewController.deleteInterviewReportController
);

module.exports = interviewRouter;