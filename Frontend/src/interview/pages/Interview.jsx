/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import { useInterview } from "../../hooks/useInterview";
import { useNavigate, useParams } from "react-router-dom";

// ============================================================
// ICONS
// ============================================================

const Icons = {
  code: (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),

  behavior: (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),

  roadmap: (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  ),

  arrow: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  ),

  chevron: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),

  back: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  ),

  sparkles: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l1.8 5.7L19.5 10l-5.7 1.8L12 17.5l-1.8-5.7L4.5 10l5.7-2.3L12 2z" />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
    </svg>
  ),

  check: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),

  alert: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

// ============================================================
// NAVIGATION
// ============================================================

const NAV_ITEMS = [
  {
    id: "technical",
    label: "Technical Questions",
    shortLabel: "Technical",
    icon: Icons.code,
  },
  {
    id: "behavioral",
    label: "Behavioral Questions",
    shortLabel: "Behavioral",
    icon: Icons.behavior,
  },
  {
    id: "roadmap",
    label: "Preparation Roadmap",
    shortLabel: "Roadmap",
    icon: Icons.roadmap,
  },
];

// ============================================================
// QUESTION CARD
// ============================================================

const QuestionCard = ({ item, index }) => {
  const [open, setOpen] = useState(false);

  return (
    <article
      className={`group rounded-xl border transition-all duration-200 ${
        open
          ? "border-zinc-700 bg-zinc-900/70"
          : "border-zinc-800 bg-zinc-950 hover:border-zinc-700 hover:bg-zinc-900/50"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="w-full text-left p-5 flex items-start gap-4 cursor-pointer"
        aria-expanded={open}
      >
        {/* Question Number */}

        <span
          className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-[11px] font-semibold border transition-colors ${
            open
              ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
              : "bg-zinc-900 border-zinc-800 text-gray-500"
          }`}
        >
          Q{index + 1}
        </span>

        {/* Question */}

        <p className="flex-1 text-sm sm:text-[15px] leading-6 text-gray-200 pt-1">
          {item?.question || "Question unavailable"}
        </p>

        {/* Chevron */}

        <span
          className={`shrink-0 text-gray-600 transition-transform duration-200 mt-1 ${
            open ? "rotate-180 text-gray-300" : ""
          }`}
        >
          {Icons.chevron}
        </span>
      </button>

      {/* Answer */}

      {open && (
        <div className="px-5 pb-5">
          <div className="ml-[52px] border-t border-zinc-800 pt-5 space-y-5">
            {/* Intention */}

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  Interviewer Intention
                </span>
              </div>

              <p className="text-sm text-gray-400 leading-6">
                {item?.intention || "No interviewer intention was provided."}
              </p>
            </div>

            {/* Model Answer */}

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  Model Answer
                </span>
              </div>

              <div className="rounded-xl bg-black border border-zinc-800 p-4">
                <p className="text-sm text-gray-300 leading-7 whitespace-pre-line">
                  {item?.answer || "No model answer was provided."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

// ============================================================
// ROADMAP DAY
// ============================================================

const RoadMapDay = ({ day }) => {
  const tasks = Array.isArray(day?.tasks) ? day.tasks : [];

  return (
    <article className="relative rounded-xl border border-zinc-800 bg-zinc-950 p-5 hover:border-zinc-700 transition-colors duration-200">
      <div className="flex items-start gap-4">
        {/* Day */}

        <div className="shrink-0">
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <span className="text-xs font-semibold text-purple-400">
              {day?.day ?? "—"}
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase tracking-wider text-gray-600">
              Day {day?.day ?? "—"}
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-semibold text-white mt-1">
            {day?.focus || "Preparation Focus"}
          </h3>

          {tasks.length > 0 && (
            <ul className="mt-4 space-y-3">
              {tasks.map((task, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-sm text-gray-400 leading-5"
                >
                  <span className="shrink-0 mt-1 w-5 h-5 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-gray-500">
                    {Icons.check}
                  </span>

                  <span>{task}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
};

// ============================================================
// MATCH SCORE
// ============================================================

const MatchScore = ({ score }) => {
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0));

  const scoreType = safeScore >= 80 ? "high" : safeScore >= 60 ? "mid" : "low";

  const scoreStyles = {
    high: {
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/5",
      text: "text-emerald-400",
      label: "Strong alignment",
    },

    mid: {
      border: "border-yellow-500/30",
      bg: "bg-yellow-500/5",
      text: "text-yellow-400",
      label: "Moderate alignment",
    },

    low: {
      border: "border-red-500/30",
      bg: "bg-red-500/5",
      text: "text-red-400",
      label: "Needs improvement",
    },
  };

  const style = scoreStyles[scoreType];

  return (
    <div className="text-center">
      <p className="text-[10px] uppercase tracking-[0.18em] text-gray-600 font-semibold">
        Resume Match
      </p>

      <div
        className={`relative mx-auto mt-5 w-32 h-32 rounded-full border-4 ${style.border} ${style.bg} flex items-center justify-center`}
      >
        {/* Inner Ring */}

        <div
          className={`absolute inset-2 rounded-full border border-zinc-800 ${style.bg}`}
        />

        <div className="relative flex items-baseline">
          <span className={`text-4xl font-bold ${style.text}`}>
            {safeScore}
          </span>

          <span className={`text-sm font-semibold ml-0.5 ${style.text}`}>
            %
          </span>
        </div>
      </div>

      <p className={`text-sm font-medium mt-4 ${style.text}`}>{style.label}</p>

      <p className="text-xs text-gray-600 mt-1">
        Based on the provided profile
      </p>
    </div>
  );
};

// ============================================================
// LOADING SCREEN
// ============================================================

const LoadingScreen = () => {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />

      <div className="absolute w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-pulse [animation-delay:700ms]" />

      <div className="relative flex flex-col items-center">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border border-blue-500/20" />

          <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin" />

          <div className="absolute inset-2 rounded-full border-r-2 border-purple-500 animate-spin [animation-duration:1.5s]" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold text-sm shadow-[0_0_30px_rgba(255,255,255,0.3)] animate-pulse">
              AI
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-white text-lg font-semibold tracking-wide">
            Interview AI
          </h2>

          <p className="text-gray-500 text-sm mt-2">
            Loading your interview strategy
            <span className="inline-flex ml-1">
              <span className="animate-bounce">.</span>

              <span className="animate-bounce [animation-delay:150ms]">.</span>

              <span className="animate-bounce [animation-delay:300ms]">.</span>
            </span>
          </p>
        </div>
      </div>
    </main>
  );
};

// ============================================================
// ERROR SCREEN
// ============================================================

const ErrorScreen = ({ onBack }) => {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
          {Icons.alert}
        </div>

        <h1 className="text-2xl font-bold mt-6">Interview plan not found</h1>

        <p className="text-sm text-gray-500 mt-3 leading-6">
          We couldn't load this interview plan. It may have been deleted or the
          link may be invalid.
        </p>

        <button
          type="button"
          onClick={onBack}
          className="mt-7 inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-gray-200 active:scale-[0.98] transition-all"
        >
          {Icons.back}
          Back to Interview Plans
        </button>
      </div>
    </main>
  );
};

// ============================================================
// EMPTY STATE
// ============================================================

const EmptyState = ({ text }) => {
  return (
    <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950 p-10 text-center">
      <div className="mx-auto w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-gray-600 flex items-center justify-center">
        {Icons.sparkles}
      </div>

      <p className="text-sm text-gray-600 mt-4">{text}</p>
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const Interview = () => {
  const [activeNav, setActiveNav] = useState("technical");

  const { report, getReportById, loading } = useInterview();

  const { interviewId } = useParams();

  const navigate = useNavigate();

  // ==========================================================
  // FETCH REPORT
  // ==========================================================

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId]);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return <LoadingScreen />;
  }

  // ==========================================================
  // REPORT NOT FOUND
  // ==========================================================

  if (!report) {
    return <ErrorScreen onBack={() => navigate("/")} />;
  }

  // ==========================================================
  // SAFE DATA
  // ==========================================================

  const technicalQuestions = Array.isArray(report.technicalQuestions)
    ? report.technicalQuestions
    : [];

  const behavioralQuestions = Array.isArray(report.behavioralQuestions)
    ? report.behavioralQuestions
    : [];

  const preparationPlan = Array.isArray(report.preparationPlan)
    ? report.preparationPlan
    : [];

  const skillGaps = Array.isArray(report.skillGaps) ? report.skillGaps : [];

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* ======================================================
          AMBIENT BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed -top-40 -left-40 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[130px]" />

      <div className="pointer-events-none fixed top-1/3 -right-40 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[130px]" />

      {/* ======================================================
          TOP HEADER
      ====================================================== */}

      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-black/80 backdrop-blur-xl">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand */}

          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-9 h-9 shrink-0 rounded-xl bg-white text-black flex items-center justify-center font-bold text-xs hover:bg-gray-200 transition-colors"
            >
              AI
            </button>

            <div className="hidden sm:block min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                Interview AI
              </p>

              <p className="text-[11px] text-gray-600">
                Personalized preparation
              </p>
            </div>
          </div>

          {/* Center title */}

          <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {Icons.sparkles}

              <span>AI Interview Strategy</span>
            </div>
          </div>

          {/* Back */}

          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 h-9 px-3 rounded-lg border border-zinc-800 text-xs text-gray-400 hover:text-white hover:bg-zinc-900 transition-all"
          >
            {Icons.back}

            <span className="hidden sm:inline">All Plans</span>
          </button>
        </div>
      </header>

      {/* ======================================================
          PAGE
      ====================================================== */}

      <div className="relative max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ====================================================
            REPORT HEADER
        ==================================================== */}

        <section className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-3 rounded-md bg-blue-500/10 border border-blue-500/20 text-[10px] uppercase tracking-wider text-blue-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Interview Strategy
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {report.title || "Your Interview Plan"}
              </h1>

              <p className="text-sm text-gray-500 mt-2 max-w-2xl">
                Your personalized technical questions, behavioral preparation,
                and day-by-day roadmap.
              </p>
            </div>

            <div className="text-xs text-gray-600">
              {report.createdAt
                ? `Generated ${new Date(report.createdAt).toLocaleDateString()}`
                : "AI Generated"}
            </div>
          </div>
        </section>

        {/* ====================================================
            MAIN GRID
        ==================================================== */}

        <div className="grid xl:grid-cols-[220px_minmax(0,1fr)_280px] gap-6">
          {/* ==================================================
              LEFT NAV
          ================================================== */}

          <aside className="xl:sticky xl:top-24 xl:self-start">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-3">
              <p className="px-3 pt-2 pb-3 text-[10px] uppercase tracking-[0.16em] text-gray-600 font-semibold">
                Sections
              </p>

              <div className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const active = activeNav === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveNav(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left text-sm transition-all duration-200 cursor-pointer ${
                        active
                          ? "bg-white text-black font-medium shadow-lg"
                          : "text-gray-500 hover:text-white hover:bg-zinc-900"
                      }`}
                    >
                      <span
                        className={`shrink-0 ${
                          active ? "text-black" : "text-gray-600"
                        }`}
                      >
                        {item.icon}
                      </span>

                      <span className="hidden xl:block">{item.label}</span>

                      <span className="xl:hidden">{item.shortLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* ==================================================
              CENTER CONTENT
          ================================================== */}

          <section className="min-w-0">
            {/* TECHNICAL */}

            {activeNav === "technical" && (
              <div>
                <div className="flex items-end justify-between mb-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-blue-400 font-semibold mb-1">
                      Technical Round
                    </p>

                    <h2 className="text-xl font-semibold">
                      Technical Questions
                    </h2>
                  </div>

                  <span className="text-xs text-gray-600">
                    {technicalQuestions.length}{" "}
                    {technicalQuestions.length === 1 ? "question" : "questions"}
                  </span>
                </div>

                {technicalQuestions.length > 0 ? (
                  <div className="space-y-3">
                    {technicalQuestions.map((question, index) => (
                      <QuestionCard key={index} item={question} index={index} />
                    ))}
                  </div>
                ) : (
                  <EmptyState text="No technical questions were generated." />
                )}
              </div>
            )}

            {/* BEHAVIORAL */}

            {activeNav === "behavioral" && (
              <div>
                <div className="flex items-end justify-between mb-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-purple-400 font-semibold mb-1">
                      Behavioral Round
                    </p>

                    <h2 className="text-xl font-semibold">
                      Behavioral Questions
                    </h2>
                  </div>

                  <span className="text-xs text-gray-600">
                    {behavioralQuestions.length}{" "}
                    {behavioralQuestions.length === 1
                      ? "question"
                      : "questions"}
                  </span>
                </div>

                {behavioralQuestions.length > 0 ? (
                  <div className="space-y-3">
                    {behavioralQuestions.map((question, index) => (
                      <QuestionCard key={index} item={question} index={index} />
                    ))}
                  </div>
                ) : (
                  <EmptyState text="No behavioral questions were generated." />
                )}
              </div>
            )}

            {/* ROADMAP */}

            {activeNav === "roadmap" && (
              <div>
                <div className="flex items-end justify-between mb-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-purple-400 font-semibold mb-1">
                      Preparation Plan
                    </p>

                    <h2 className="text-xl font-semibold">
                      Preparation Roadmap
                    </h2>
                  </div>

                  <span className="text-xs text-gray-600">
                    {preparationPlan.length}-day plan
                  </span>
                </div>

                {preparationPlan.length > 0 ? (
                  <div className="space-y-3">
                    {preparationPlan.map((day, index) => (
                      <RoadMapDay key={day?.day ?? index} day={day} />
                    ))}
                  </div>
                ) : (
                  <EmptyState text="No preparation roadmap was generated." />
                )}
              </div>
            )}
          </section>

          {/* ==================================================
              RIGHT SIDEBAR
          ================================================== */}

          <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
            {/* Match Score */}

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
              <MatchScore score={report.matchScore} />
            </div>

            {/* Skill Gaps */}

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-gray-600 font-semibold">
                    Analysis
                  </p>

                  <h3 className="text-sm font-semibold mt-1">Skill Gaps</h3>
                </div>

                <span className="text-xs text-gray-600">
                  {skillGaps.length}
                </span>
              </div>

              {skillGaps.length > 0 ? (
                <div className="space-y-2">
                  {skillGaps.map((gap, index) => {
                    const severity = gap?.severity || "medium";

                    const severityStyle =
                      severity === "high"
                        ? "bg-red-500/10 border-red-500/20 text-red-400"
                        : severity === "low"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";

                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border ${severityStyle}`}
                      >
                        <span className="text-xs font-medium">
                          {gap?.skill || "Unknown skill"}
                        </span>

                        <span className="text-[9px] uppercase tracking-wider opacity-70">
                          {severity}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-600">
                  No skill gaps identified.
                </p>
              )}
            </div>

            {/* AI Tip */}

            <div className="rounded-2xl border border-blue-500/10 bg-blue-500/5 p-5">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                {Icons.sparkles}

                <span className="text-xs font-semibold">
                  AI Preparation Tip
                </span>
              </div>

              <p className="text-xs text-gray-500 leading-5">
                Start with the questions marked as difficult and practice
                explaining your reasoning out loud. Focus on clarity, structure,
                and concrete examples.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Interview;
