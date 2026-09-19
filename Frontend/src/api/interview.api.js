import axios from "axios";

// ============================================================
// API CLIENT
// ============================================================

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// ============================================================
// ERROR HANDLER
// ============================================================

const handleApiError = (error) => {
  console.error("Interview API Error:", error);

  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong. Please try again.";

  throw new Error(message);
};

// ============================================================
// GENERATE INTERVIEW REPORT
// ============================================================

/**
 * Generate a personalized interview report using:
 * - Job role
 * - Job description
 * - Candidate self-description
 * - Resume
 *
 * @param {Object} params
 * @param {string} params.jobRole
 * @param {string} params.jobDescription
 * @param {string} params.selfDescription
 * @param {File} params.resumeFile
 * @returns {Promise<Object>}
 */

export const generateInterviewReport = async ({
  jobRole,
  jobDescription,
  selfDescription,
  resumeFile,
}) => {
  try {
    // Validate required fields

    if (!jobRole?.trim()) {
      throw new Error("Job role is required.");
    }

    if (!jobDescription?.trim()) {
      throw new Error("Job description is required.");
    }

    if (!selfDescription?.trim()) {
      throw new Error("Self description is required.");
    }

    if (!resumeFile) {
      throw new Error("Resume is required.");
    }

    const formData = new FormData();

    formData.append("jobRole", jobRole.trim());
    formData.append(
      "jobDescription",
      jobDescription.trim()
    );
    formData.append(
      "selfDescription",
      selfDescription.trim()
    );
    formData.append("resume", resumeFile);

    const response = await api.post(
      "/api/interview/",
      formData
    );

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// ============================================================
// GET INTERVIEW REPORT BY ID
// ============================================================

/**
 * Get a single interview report by its ID.
 *
 * @param {string} interviewId
 * @returns {Promise<Object>}
 */

export const getInterviewReportById = async (
  interviewId
) => {
  try {
    if (!interviewId) {
      throw new Error("Interview ID is required.");
    }

    const response = await api.get(
      `/api/interview/report/${interviewId}`
    );

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// ============================================================
// GET ALL INTERVIEW REPORTS
// ============================================================

/**
 * Get all interview reports belonging to
 * the currently authenticated user.
 *
 * @returns {Promise<Object>}
 */

export const getAllInterviewReports = async () => {
  try {
    const response = await api.get(
      "/api/interview/"
    );

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// ============================================================
// DELETE INTERVIEW REPORT
// ============================================================

/**
 * Delete an interview report.
 *
 * The backend verifies that the report belongs
 * to the currently authenticated user.
 *
 * @param {string} interviewId
 * @returns {Promise<Object>}
 */

export const deleteInterviewReport = async (
  interviewId
) => {
  try {
    if (!interviewId) {
      throw new Error("Interview ID is required.");
    }

    const response = await api.delete(
      `/api/interview/report/${interviewId}`
    );

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};