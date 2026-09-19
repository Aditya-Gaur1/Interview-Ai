import { useState } from "react";
import { useInterview } from "../../hooks/useInterview";
import { useNavigate } from "react-router-dom";
import UserMenu from "../../components/UserMenu.jsx";

const Home = () => {
  const {
    loading,
    generateReport,
    reports = [],
    deleteReport,
  } = useInterview();

  const navigate = useNavigate();

  // ============================================================
  // FORM STATE
  // ============================================================

  const [jobRole, setJobRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [error, setError] = useState("");

  // ============================================================
  // CONSTANTS
  // ============================================================

  const MAX_JOB_DESCRIPTION_LENGTH = 5000;
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  // ============================================================
  // FILE HANDLING
  // ============================================================

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];

    setError("");

    if (!file) {
      setResumeFile(null);
      return;
    }

    // Validate file type

    if (
      file.type !== "application/pdf" &&
      file.type !==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      setError("Please upload a PDF or DOCX file.");

      e.target.value = "";

      setResumeFile(null);

      return;
    }

    // Validate file size

    if (file.size > MAX_FILE_SIZE) {
      setError("Resume must be smaller than 5MB.");

      e.target.value = "";

      setResumeFile(null);

      return;
    }

    setResumeFile(file);
  };

  // ============================================================
  // GENERATE REPORT
  // ============================================================

  const handleGenerateReport = async () => {
    setError("");

    const trimmedJobRole = jobRole.trim();
    const trimmedJobDescription = jobDescription.trim();
    const trimmedSelfDescription = selfDescription.trim();

    // ----------------------------------------------------------
    // VALIDATION
    // ----------------------------------------------------------

    if (!trimmedJobRole) {
      setError("Please enter the target job role.");
      return;
    }

    if (!trimmedJobDescription) {
      setError("Please enter the target job description.");
      return;
    }

    if (!trimmedSelfDescription) {
      setError("Please provide a self-description.");
      return;
    }

    if (!resumeFile) {
      setError("Please upload your resume.");
      return;
    }

    // ----------------------------------------------------------
    // GENERATE
    // ----------------------------------------------------------

    try {
      const data = await generateReport({
        jobRole: trimmedJobRole,
        jobDescription: trimmedJobDescription,
        selfDescription: trimmedSelfDescription,
        resumeFile,
      });

      if (!data?._id) {
        setError("Unable to generate your interview plan. Please try again.");

        return;
      }

      navigate(`/interview/${data._id}`);
    } catch (err) {
      console.error("Generate report error:", err);

      setError(
        err?.message ||
          "Something went wrong while generating your interview plan.",
      );
    }
  };

  // ============================================================
  // DELETE REPORT
  // ============================================================

  const handleDeleteReport = async (interviewId) => {
    const confirmed = window.confirm(
      "Delete this interview plan? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteReport(interviewId);
    } catch (err) {
      console.error("Delete interview plan error:", err);

      setError(
        err?.message ||
          "Unable to delete the interview plan. Please try again.",
      );
    }
  };

  // ============================================================
  // LOADING SCREEN
  // ============================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden px-4">
        {/* Ambient Background */}

        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />

        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />

        <div className="relative flex flex-col items-center">
          {/* Loader */}

          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border border-blue-500/20" />

            <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin" />

            <div className="absolute inset-2 rounded-full border-r-2 border-purple-500 animate-spin [animation-duration:1.5s]" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold text-sm shadow-[0_0_30px_rgba(255,255,255,0.25)] animate-pulse">
                AI
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <h2 className="text-white text-lg font-semibold tracking-wide">
              Interview AI
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              Preparing your interview workspace
              <span className="inline-flex ml-1">
                <span className="animate-bounce">.</span>

                <span className="animate-bounce [animation-delay:150ms]">
                  .
                </span>

                <span className="animate-bounce [animation-delay:300ms]">
                  .
                </span>
              </span>
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ============================================================
  // MAIN PAGE
  // ============================================================

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* ========================================================
          AMBIENT BACKGROUND
      ======================================================== */}

      <div className="pointer-events-none absolute -top-40 -left-40 w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-[140px]" />

      <div className="pointer-events-none absolute top-[35%] -right-40 w-[550px] h-[550px] bg-purple-600/10 rounded-full blur-[140px]" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 w-[400px] h-[300px] bg-blue-500/5 rounded-full blur-[120px]" />

      {/* ========================================================
          NAVBAR
      ======================================================== */}

      <header className="relative z-50 border-b border-zinc-900 bg-black/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}

          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-3 group"
          >
            <div className="relative cursor-pointer w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-bold text-xs shadow-[0_0_25px_rgba(255,255,255,0.12)] group-hover:scale-105 transition-transform">
              AI
            </div>

            <div className="text-left">
              <p className="text-sm font-semibold text-white tracking-tight">
                Interview AI
              </p>

              <p className="hidden sm:block text-[10px] text-zinc-600">
                Personalized preparation
              </p>
            </div>
          </button>

          {/* Right Side */}

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs text-zinc-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
              AI Ready
            </div>

            <UserMenu />
          </div>
        </div>
      </header>

      {/* ========================================================
          CONTENT
      ======================================================== */}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        {/* ======================================================
            HERO
        ====================================================== */}

        <section className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-950/80 text-xs text-zinc-400 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            AI-Powered Interview Preparation
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
            Prepare smarter.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              Interview with confidence.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-500 leading-relaxed mt-6">
            Give us the job you're targeting, your resume, and your background.
            Our AI analyzes everything to create a personalized interview
            preparation strategy.
          </p>
        </section>

        {/* ======================================================
            MAIN GENERATOR CARD
        ====================================================== */}

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">
          {/* Card Header */}

          <div className="px-6 sm:px-8 lg:px-10 py-6 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />

                <h2 className="text-sm font-semibold text-white">
                  Create Interview Plan
                </h2>
              </div>

              <p className="text-xs text-zinc-600 mt-1 ml-4">
                Complete the details below for a personalized analysis.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-zinc-600">
              <span className="px-2 py-1 rounded-md bg-zinc-900 border border-zinc-800">
                4 inputs
              </span>

              <span>•</span>

              <span>~30 sec</span>
            </div>
          </div>

          {/* ====================================================
              FORM
          ==================================================== */}

          <div className="grid lg:grid-cols-2">
            {/* ==================================================
                LEFT COLUMN
            ================================================== */}

            <div className="p-6 sm:p-8 lg:p-10 space-y-8">
              {/* Job Role */}

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label
                    htmlFor="jobRole"
                    className="text-sm font-medium text-zinc-200"
                  >
                    Target Job Role
                  </label>

                  <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400">
                    Required
                  </span>
                </div>

                <input
                  id="jobRole"
                  type="text"
                  value={jobRole}
                  onChange={(e) => {
                    setJobRole(e.target.value);
                    setError("");
                  }}
                  placeholder="e.g. MERN Stack Developer"
                  className="w-full h-12 rounded-xl bg-black border border-zinc-800 px-4 text-sm text-white placeholder:text-zinc-700 outline-none transition-all focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                />

                <p className="text-xs text-zinc-600 mt-2">
                  The role you are preparing to interview for.
                </p>
              </div>

              {/* Job Description */}

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label
                    htmlFor="jobDescription"
                    className="text-sm font-medium text-zinc-200"
                  >
                    Job Description
                  </label>

                  <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400">
                    Required
                  </span>
                </div>

                <p className="text-xs text-zinc-600 mb-3">
                  Paste the job description from the company.
                </p>

                <div className="relative">
                  <textarea
                    id="jobDescription"
                    value={jobDescription}
                    onChange={(e) => {
                      setJobDescription(e.target.value);
                      setError("");
                    }}
                    maxLength={MAX_JOB_DESCRIPTION_LENGTH}
                    placeholder={`Paste the full job description here...

Example:
Looking for a MERN Stack Developer with strong
React, Node.js, Express and MongoDB experience...`}
                    className="w-full min-h-[280px] resize-none rounded-xl bg-black border border-zinc-800 px-4 py-4 pb-10 text-sm text-white placeholder:text-zinc-700 outline-none transition-all focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 leading-relaxed"
                  />

                  <div className="absolute bottom-3 right-3 text-[10px] text-zinc-700 bg-black px-2 py-1 rounded-md">
                    {jobDescription.length} / {MAX_JOB_DESCRIPTION_LENGTH}
                  </div>
                </div>
              </div>
            </div>

            {/* ==================================================
                RIGHT COLUMN
            ================================================== */}

            <div className="p-6 sm:p-8 lg:p-10 border-t lg:border-t-0 lg:border-l border-zinc-800 space-y-8">
              {/* Resume */}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="resume"
                      className="text-sm font-medium text-zinc-200"
                    >
                      Your Resume
                    </label>

                    <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400">
                      Required
                    </span>
                  </div>

                  {resumeFile && (
                    <span className="text-[10px] text-emerald-400">
                      Uploaded
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-600 mb-3">
                  Upload the resume you want the AI to analyze.
                </p>

                <label
                  htmlFor="resume"
                  className={`group relative flex flex-col items-center justify-center min-h-[180px] rounded-xl border border-dashed cursor-pointer transition-all duration-200 ${
                    resumeFile
                      ? "border-emerald-500/40 bg-emerald-500/5"
                      : "border-zinc-700 bg-black hover:border-zinc-500 hover:bg-zinc-900/50"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                      resumeFile
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-zinc-900 text-zinc-500 group-hover:text-white"
                    }`}
                  >
                    {resumeFile ? (
                      <svg
                        width="23"
                        height="23"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M5 12l4 4L19 6" />
                      </svg>
                    ) : (
                      <svg
                        width="23"
                        height="23"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <polyline points="16 16 12 12 8 16" />
                        <line x1="12" y1="12" x2="12" y2="21" />
                        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                      </svg>
                    )}
                  </div>

                  {resumeFile ? (
                    <>
                      <p className="text-sm font-medium text-emerald-400 text-center px-4 truncate max-w-[90%]">
                        {resumeFile.name}
                      </p>

                      <p className="text-xs text-zinc-600 mt-1">
                        {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>

                      <p className="text-[11px] text-zinc-700 mt-2">
                        Click to replace
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-zinc-300">
                        Click to upload
                      </p>

                      <p className="text-xs text-zinc-700 mt-1">
                        PDF or DOCX · Maximum 5MB
                      </p>
                    </>
                  )}

                  <input
                    onChange={handleResumeChange}
                    hidden
                    type="file"
                    id="resume"
                    name="resume"
                    accept=".pdf,.docx"
                  />
                </label>
              </div>

              {/* Self Description */}

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label
                    htmlFor="selfDescription"
                    className="text-sm font-medium text-zinc-200"
                  >
                    About You
                  </label>

                  <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400">
                    Required
                  </span>
                </div>

                <p className="text-xs text-zinc-600 mb-3">
                  Give the AI additional context that may not be obvious from
                  your resume.
                </p>

                <textarea
                  id="selfDescription"
                  value={selfDescription}
                  onChange={(e) => {
                    setSelfDescription(e.target.value);
                    setError("");
                  }}
                  placeholder="Mention your experience, projects, skills, DSA preparation, technologies, or anything else the interviewer should know..."
                  className="w-full min-h-[180px] resize-none rounded-xl bg-black border border-zinc-800 px-4 py-4 text-sm text-white placeholder:text-zinc-700 outline-none transition-all focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* ====================================================
              ERROR
          ==================================================== */}

          {error && (
            <div className="px-6 sm:px-8 lg:px-10 pb-6">
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 flex items-center gap-3">
                <div className="w-7 h-7 shrink-0 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4" />
                    <path d="M12 16h.01" />
                  </svg>
                </div>

                <p className="text-sm text-red-400">{error}</p>
              </div>
            </div>
          )}

          {/* ====================================================
              GENERATE FOOTER
          ==================================================== */}

          <div className="border-t border-zinc-800 px-6 sm:px-8 lg:px-10 py-5 bg-black/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-zinc-600">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Your data powers your personalized analysis.
              <span className="text-zinc-800">•</span>
              Approx. 30 seconds
            </div>

            <button
              type="button"
              onClick={handleGenerateReport}
              disabled={loading}
              className="w-full cursor-pointer sm:w-auto min-w-[250px] h-12 px-6 rounded-xl bg-white text-black text-sm font-semibold flex items-center justify-center gap-2 hover:bg-zinc-200 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
              </svg>
              Generate Interview Strategy
            </button>
          </div>
        </section>

        {/* ======================================================
            RECENT REPORTS
        ====================================================== */}

        {reports.length > 0 && (
          <section className="mt-14">
            <div className="flex items-end justify-between mb-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600 mb-1">
                  Workspace
                </p>

                <h2 className="text-xl font-semibold text-white">
                  Recent Interview Plans
                </h2>
              </div>

              <span className="text-xs text-zinc-600">
                {reports.length} {reports.length === 1 ? "plan" : "plans"}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reports.map((report) => {
                const score = report.matchScore ?? 0;

                return (
                  <div
                    key={report._id}
                    className="group relative rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 hover:border-zinc-600 hover:bg-zinc-900/80 transition-all duration-200"
                  >
                    {/* ==================================================
                        DELETE BUTTON
                    ================================================== */}

                    <button
                      type="button"
                      onClick={() => handleDeleteReport(report._id)}
                      className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 z-10"
                      title="Delete interview plan"
                      aria-label="Delete interview plan"
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v5" />
                        <path d="M14 11v5" />
                        <path d="M9 6V4h6v2" />
                      </svg>
                    </button>

                    {/* ==================================================
                        OPEN INTERVIEW PLAN
                    ================================================== */}

                    <button
                      type="button"
                      onClick={() => navigate(`/interview/${report._id}`)}
                      className="w-full text-left cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-4 pr-8">
                        <div className="min-w-0">
                          <h3 className="font-medium text-white truncate group-hover:text-blue-400 transition-colors">
                            {report.jobRole ||
                              report.title ||
                              "Untitled Position"}
                          </h3>

                          <p className="text-xs text-zinc-600 mt-1">
                            {report.createdAt
                              ? new Date(report.createdAt).toLocaleDateString()
                              : "Recently generated"}
                          </p>
                        </div>

                        <div
                          className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-xs font-semibold border ${
                            score >= 80
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                              : score >= 60
                                ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                                : "bg-red-500/10 border-red-500/20 text-red-400"
                          }`}
                        >
                          {score}%
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-zinc-900 flex items-center justify-between text-xs">
                        <span className="text-zinc-600">Match Score</span>

                        <span className="text-zinc-500 group-hover:text-white transition-colors">
                          View plan →
                        </span>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ======================================================
            EMPTY STATE
        ====================================================== */}

        {reports.length === 0 && (
          <section className="mt-12 text-center">
            <div className="inline-flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl border border-zinc-800 bg-zinc-950 flex items-center justify-center mb-4">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-zinc-600"
                >
                  <path d="M4 4h16v16H4z" />
                  <path d="M8 9h8M8 13h5" />
                </svg>
              </div>

              <p className="text-sm text-zinc-600">
                Your generated interview plans will appear here.
              </p>
            </div>
          </section>
        )}

        {/* ======================================================
            FOOTER
        ====================================================== */}

        <footer className="mt-16 pb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-700">
          <p>Interview AI · Personalized preparation powered by AI</p>

          <div className="flex items-center gap-5">
            <button
              type="button"
              className="hover:text-zinc-400 transition-colors"
            >
              Privacy
            </button>

            <button
              type="button"
              className="hover:text-zinc-400 transition-colors"
            >
              Terms
            </button>

            <button
              type="button"
              className="hover:text-zinc-400 transition-colors"
            >
              Help
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default Home;
