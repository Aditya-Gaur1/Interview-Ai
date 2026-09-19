import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
  deleteInterviewReport,
} from "../api/interview.api.js";

import {
  useCallback,
  useContext,
  useEffect,
} from "react";

import { InterviewContext } from "../context/Interview.context.jsx";
import { useParams } from "react-router-dom";

// ============================================================
// INTERVIEW HOOK
// ============================================================

export const useInterview = () => {
  const context = useContext(InterviewContext);

  const { interviewId } = useParams();

  // ==========================================================
  // CONTEXT VALIDATION
  // ==========================================================

  if (!context) {
    throw new Error(
      "useInterview must be used within an InterviewProvider"
    );
  }

  const {
    loading,
    setLoading,

    report,
    setReport,

    reports,
    setReports,
  } = context;

  // ==========================================================
  // GENERATE INTERVIEW REPORT
  // ==========================================================

  const generateReport = useCallback(
    async ({
      jobRole,
      jobDescription,
      selfDescription,
      resumeFile,
    }) => {
      setLoading(true);

      try {
        const response =
          await generateInterviewReport({
            jobRole,
            jobDescription,
            selfDescription,
            resumeFile,
          });

        const interviewReport =
          response?.interviewReport;

        if (!interviewReport) {
          throw new Error(
            "Interview report was not returned by the server."
          );
        }

        // Update current report immediately.
        setReport(interviewReport);

        // Add newly generated report to the reports list.
        setReports((previousReports = []) => {
          const existingReports =
            previousReports.filter(
              (item) =>
                item?._id !== interviewReport?._id
            );

          return [
            interviewReport,
            ...existingReports,
          ];
        });

        return interviewReport;
      } catch (error) {
        console.error(
          "Generate interview report error:",
          error
        );

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setReport, setReports]
  );

  // ==========================================================
  // GET REPORT BY ID
  // ==========================================================

  const getReportById = useCallback(
    async (id) => {
      if (!id) {
        return null;
      }

      setLoading(true);

      try {
        const response =
          await getInterviewReportById(id);

        const interviewReport =
          response?.interviewReport;

        if (!interviewReport) {
          throw new Error(
            "Interview report was not returned by the server."
          );
        }

        setReport(interviewReport);

        return interviewReport;
      } catch (error) {
        console.error(
          "Get interview report error:",
          error
        );

        setReport(null);

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setReport]
  );

  // ==========================================================
  // GET ALL REPORTS
  // ==========================================================

  const getReports = useCallback(
    async () => {
      setLoading(true);

      try {
        const response =
          await getAllInterviewReports();

        const interviewReports =
          response?.interviewReports || [];

        setReports(interviewReports);

        return interviewReports;
      } catch (error) {
        console.error(
          "Get interview reports error:",
          error
        );

        setReports([]);

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setReports]
  );

  // ==========================================================
  // DELETE INTERVIEW REPORT
  // ==========================================================

  const deleteReport = useCallback(
    async (interviewReportId) => {
      if (!interviewReportId) {
        throw new Error(
          "Interview report ID is required."
        );
      }

      try {
        // Delete from backend
        await deleteInterviewReport(
          interviewReportId
        );

        // Remove from recent reports immediately
        setReports((previousReports = []) =>
          previousReports.filter(
            (item) =>
              item?._id !== interviewReportId
          )
        );

        // If the deleted report is currently open,
        // clear it from the context.
        setReport((previousReport) =>
          previousReport?._id === interviewReportId
            ? null
            : previousReport
        );

        return true;
      } catch (error) {
        console.error(
          "Delete interview report error:",
          error
        );

        throw error;
      }
    },
    [setReports, setReport]
  );

  // ==========================================================
  // AUTOMATIC DATA FETCHING
  // ==========================================================

  useEffect(() => {
    const loadInterviewData = async () => {
      try {
        if (interviewId) {
          await getReportById(interviewId);
        } else {
          await getReports();
        }
      } catch (error) {
        console.error(
          "Failed to load interview data:",
          error
        );
      }
    };

    loadInterviewData();
  }, [
    interviewId,
    getReportById,
    getReports,
  ]);

  // ==========================================================
  // PUBLIC API
  // ==========================================================

  return {
    loading,
    report,
    reports,
    generateReport,
    getReportById,
    getReports,
    deleteReport,
  };
};