const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 100 indicating how well candidate's profile matches the job describe",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "The technical question that can be asked in the interview",
          ),

        intention: z
          .string()
          .describe(
            "The intention of the interviewer behind asking the question",
          ),

        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, and what approach to take",
          ),
      }),
    )
    .describe(
      "Technical questions that can be asked in the interview along with their intention and how to answer them",
    ),

  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "The behavioral question that can be asked in the interview",
          ),

        intention: z
          .string()
          .describe(
            "The intention of the interviewer behind asking the question",
          ),

        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, and what approach to take",
          ),
      }),
    )
    .describe(
      "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
    ),

  skillGaps: z
    .array(
      z.object({
        skill: z
          .string()
          .describe(
            "A technical or professional skill that the candidate needs to improve",
          ),

        severity: z
          .enum(["low", "medium", "high"])
          .describe("The severity of the candidate's skill gap"),
      }),
    )
    .describe(
      "Skills where the candidate has gaps, along with the severity of each gap",
    ),

  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .int()
          .min(1)
          .describe("The day number in the candidate's preparation plan"),

        focus: z
          .string()
          .describe(
            "The main topic or area the candidate should focus on that day",
          ),

        tasks: z
          .array(z.string())
          .describe(
            "Specific tasks the candidate should complete on that day",
          ),
      }),
    )
    .describe(
      "A personalized day-by-day preparation plan based on the candidate's skill gaps and interview requirements",
    ),
});

async function invokeGeminiAi() {
  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: "Hello gemini ! Explain what is Interview!",
  });
  console.log(response.text);
}

async function generateInterviewReport({
  resume,
  selfdescription,
  jobdescription,
}) {

  const prompt = `Generate an interview report for a candidate with the following details:
  Resume : ${resume}
  Self describe : ${selfdescription}
  Job describe : ${jobdescription}
  `


  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(interviewReportSchema),
    },
  });

  console.log(JSON.parse(response.text));
}

module.exports = generateInterviewReport;
