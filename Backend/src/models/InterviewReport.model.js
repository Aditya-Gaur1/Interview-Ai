const mongoose = require("mongoose");

const interviewQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
    },

    intention: {
      type: String,
      required: [true, "Intention is required"],
      trim: true,
    },

    answer: {
      type: String,
      required: [true, "Answer is required"],
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const skillGapSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: [true, "Skill is required"],
      trim: true,
    },

    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: [true, "Severity is required"],
    },
  },
  {
    _id: false,
  },
);

const preparationPlanSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: [true, "Day is required"],
      min: 1,
    },

    focus: {
      type: String,
      required: [true, "Focus is required"],
      trim: true,
    },

    tasks: [
      {
        type: String,
        required: [true, "Task is required"],
        trim: true,
      },
    ],
  },
  {
    _id: false,
  },
);

const interviewReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "User is required"],
      index: true,
    },

    jobRole: {
      type: String,
      required: [true, "Job role is required"],
      trim: true,
    },

    jobDescription: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
    },

    resumeText: {
      type: String,
      trim: true,
    },

    selfDescription: {
      type: String,
      trim: true,
    },

    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    technicalQuestions: [interviewQuestionSchema],
    behavioralQuestions: [interviewQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
  },
  {
    timestamps: true,
  },
);

const interviewReportModel = mongoose.model(
  "InterviewReport",
  interviewReportSchema,
);

module.exports = interviewReportModel;
