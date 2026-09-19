const pdfParse = require("pdf-parse");

const generateInterviewReport = require("../services/ai.service");

const interviewReportModel = require("../models/InterviewReport.model");

// ============================================================
// GENERATE INTERVIEW REPORT
// POST /api/interview/
// ============================================================

async function generateInterviewReportController(req, res) {
  try {
    // ============================================
    // VALIDATE RESUME
    // ============================================

    if (!req.file) {
      return res.status(400).json({
        message: "Resume file is required.",
      });
    }

    // ============================================
    // EXTRACT RESUME TEXT
    // ============================================

    const resumeContent = await new pdfParse.PDFParse(
      Uint8Array.from(req.file.buffer)
    ).getText();

    // ============================================
    // GET FORM DATA
    // ============================================

    const {
      selfDescription,
      jobDescription,
      jobRole,
    } = req.body;

    // ============================================
    // VALIDATE REQUIRED FIELDS
    // ============================================

    if (!selfDescription?.trim()) {
      return res.status(400).json({
        message: "Self description is required.",
      });
    }

    if (!jobDescription?.trim()) {
      return res.status(400).json({
        message: "Job description is required.",
      });
    }

    // ============================================
    // GENERATE AI REPORT
    // ============================================

    const interviewReportByAi = await generateInterviewReport({
      resume: resumeContent.text,
      selfdescription: selfDescription,
      jobdescription: jobDescription,
      jobrole: jobRole || "",
    });

    console.log("AI REPORT:");

    console.dir(interviewReportByAi, {
      depth: null,
    });

    // ============================================
    // SAVE REPORT
    // ============================================

    const interviewReport =
      await interviewReportModel.create({
        user: req.user.id,

        jobRole: jobRole?.trim() || "",

        jobDescription: jobDescription.trim(),

        resumeText: resumeContent.text,

        selfDescription: selfDescription.trim(),

        ...interviewReportByAi,
      });

    // ============================================
    // RESPONSE
    // ============================================

    return res.status(201).json({
      message: "Interview report generated successfully",
      interviewReport,
    });

  } catch (error) {
    console.error(
      "Generate interview report error:",
      error
    );

    return res.status(500).json({
      message:
        error?.message ||
        "Failed to generate interview report.",
    });
  }
}


// ============================================================
// GET ALL INTERVIEW REPORTS
// GET /api/interview/
// ============================================================

async function getAllInterviewReportsController(req, res) {
  try {
    const interviewReports =
      await interviewReportModel
        .find({
          user: req.user.id,
        })
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      interviewReports,
    });

  } catch (error) {
    console.error(
      "Get all interview reports error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch interview reports.",
    });
  }
}


// ============================================================
// GET SINGLE INTERVIEW REPORT
// GET /api/interview/report/:interviewId
// ============================================================

async function getInterviewReportByIdController(req, res) {
  try {
    const { interviewId } = req.params;

    const interviewReport =
      await interviewReportModel.findOne({
        _id: interviewId,
        user: req.user.id,
      });

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found.",
      });
    }

    return res.status(200).json({
      interviewReport,
    });

  } catch (error) {
    console.error(
      "Get interview report error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch interview report.",
    });
  }
}


// ============================================================
// DELETE INTERVIEW REPORT
// DELETE /api/interview/report/:interviewId
// ============================================================

async function deleteInterviewReportController(req, res) {
  try {
    const { interviewId } = req.params;

    // ============================================
    // VALIDATE INTERVIEW ID
    // ============================================

    if (!interviewId) {
      return res.status(400).json({
        message: "Interview ID is required.",
      });
    }

    // ============================================
    // DELETE ONLY USER'S OWN REPORT
    // ============================================

    const deletedReport =
      await interviewReportModel.findOneAndDelete({
        _id: interviewId,
        user: req.user.id,
      });

    // ============================================
    // REPORT NOT FOUND
    // ============================================

    if (!deletedReport) {
      return res.status(404).json({
        message: "Interview report not found.",
      });
    }

    // ============================================
    // SUCCESS
    // ============================================

    return res.status(200).json({
      message: "Interview report deleted successfully.",
      interviewId,
    });

  } catch (error) {
    console.error(
      "Delete interview report error:",
      error
    );

    return res.status(500).json({
      message: "Failed to delete interview report.",
    });
  }
}


// ============================================================
// EXPORT CONTROLLERS
// ============================================================

module.exports = {
  generateInterviewReportController,
  getAllInterviewReportsController,
  getInterviewReportByIdController,
  deleteInterviewReportController,
};