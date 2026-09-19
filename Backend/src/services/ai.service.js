const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

// ===============================
// ZOD SCHEMA
// ===============================

const interviewReportSchema = z.object({
  matchScore: z.number().min(0).max(100),

  technicalQuestions: z
    .array(
      z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string(),
      }),
    )
    .min(5),

  behavioralQuestions: z
    .array(
      z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string(),
      }),
    )
    .min(3),

  skillGaps: z
    .array(
      z.object({
        skill: z.string(),
        severity: z.enum(["low", "medium", "high"]),
      }),
    )
    .min(3),

  preparationPlan: z
    .array(
      z.object({
        day: z.number().int().min(1),
        focus: z.string(),
        tasks: z.array(z.string()).min(2),
      }),
    )
    .min(7),
});

// ===============================
// RETRY FUNCTION
// ===============================

async function generateWithRetry(request, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent(request);

      return response;
    } catch (error) {
      const statusCode = error?.status || error?.code || error?.error?.code;

      const isRetryable =
        statusCode === 503 ||
        statusCode === 429 ||
        error?.message?.includes("503") ||
        error?.message?.includes("429") ||
        error?.message?.includes("UNAVAILABLE") ||
        error?.message?.includes("RESOURCE_EXHAUSTED");

      // If error is not temporary, don't retry
      if (!isRetryable) {
        throw error;
      }

      // If this was the last attempt
      if (attempt === maxRetries) {
        console.error("Gemini API failed after", maxRetries + 1, "attempts");

        throw error;
      }

      // Exponential backoff
      const delay = 1000 * Math.pow(2, attempt);

      console.log(
        `Gemini temporarily unavailable. Retry ${attempt + 1
        }/${maxRetries} in ${delay / 1000}s...`,
      );

      await new Promise((resolve) => {
        setTimeout(resolve, delay);
      });
    }
  }
}

// ===============================
// GENERATE INTERVIEW REPORT
// ===============================

async function generateInterviewReport({
  resume,
  selfdescription,
  jobdescription,
  jobrole,
}) {
  const prompt = `
You are an expert technical interviewer, senior software engineer,
career coach, and recruitment specialist.

Your task is to analyze a candidate's complete profile and generate
a highly personalized interview preparation report for the candidate.

You MUST base the report primarily on the information provided in:
1. Candidate Resume
2. Candidate Self Description
3. Target Job Role
4. Job Description

Do NOT generate a generic interview preparation report.

Every recommendation, question, skill gap, and preparation task should
be connected to the candidate's actual profile and the requirements of
the target role.

============================================================
CANDIDATE RESUME
============================================================

${resume}

============================================================
CANDIDATE SELF DESCRIPTION
============================================================

${selfdescription}

============================================================
TARGET JOB ROLE
============================================================

${jobrole}

============================================================
JOB DESCRIPTION
============================================================

${jobdescription}

============================================================
ANALYSIS INSTRUCTIONS
============================================================

Before generating the final report, internally analyze the candidate
across the following dimensions:

1. Technical skills
2. Programming languages
3. Frameworks and libraries
4. Databases
5. Backend development
6. Frontend development
7. APIs and system integration
8. Cloud/deployment knowledge
9. Software engineering practices
10. Data structures and algorithms
11. Projects
12. Project complexity
13. Project ownership
14. Work/internship experience
15. Problem-solving experience
16. Communication/teamwork indicators
17. Education
18. Achievements
19. Job-specific requirements
20. Missing or weak requirements

Compare the candidate's profile against the target job description.

Distinguish between:

- Skills explicitly demonstrated by the candidate
- Skills mentioned but not strongly demonstrated
- Skills inferred from projects or experience
- Skills required by the job but absent from the resume
- Skills that should be verified during an interview

Do NOT assume that the candidate knows a technology simply because
it is common for the target role.

============================================================
1. MATCH SCORE
============================================================

Calculate a realistic matchScore between 0 and 100.

The score represents the candidate's current alignment with the
target job based on the available evidence.

Consider:

- Required technical skills
- Preferred technical skills
- Relevant experience
- Project relevance
- Years/level of experience
- Domain knowledge
- Education requirements
- Problem-solving skills
- Tools and technologies
- Missing requirements

Scoring guidelines:

90-100:
Very strong alignment with most important requirements.

75-89:
Strong alignment with some meaningful gaps.

60-74:
Moderate alignment with several gaps.

40-59:
Limited alignment and significant gaps.

0-39:
Major mismatch with the current requirements.

Do NOT artificially increase the score.

If the resume does not provide enough evidence for a skill,
treat that skill as unverified rather than automatically assuming
the candidate possesses it.

============================================================
2. MATCH ANALYSIS
============================================================

Identify the strongest areas of alignment between the candidate
and the target role.

The analysis should identify specific evidence from the candidate's
resume, projects, experience, or skills.

Also identify important requirements from the job description that
the candidate already satisfies.

The generated report should make it clear WHY the candidate received
the match score.

============================================================
3. TECHNICAL INTERVIEW QUESTIONS
============================================================

Generate at least 7 technical interview questions.

Prefer generating 8-10 questions when enough candidate information
is available.

Questions MUST be personalized.

Questions should be based on combinations of:

- Resume technologies
- Candidate projects
- Candidate architecture decisions
- Candidate programming languages
- Candidate frameworks
- Candidate databases
- APIs
- Authentication/authorization
- Performance
- Scalability
- Deployment
- Debugging
- Data structures and algorithms
- Job description requirements
- Target role responsibilities

Avoid generic questions such as:

"What is React?"

"What is MongoDB?"

"What is REST API?"

unless the question is connected to the candidate's actual experience
or the target role.

Prefer questions such as:

"You mentioned building X using React and Node.js. Why did you choose
this architecture, and how would you redesign it if the application
had 100,000 users?"

The questions should contain a mixture of:

- Fundamental technical questions
- Intermediate questions
- Project-specific questions
- Scenario-based questions
- Debugging questions
- Architecture/design questions
- Performance questions
- Security questions
- Follow-up questions an interviewer may ask

Each technical question MUST be an object containing:

question:
The exact question the interviewer could ask.

intention:
Explain what the interviewer is trying to evaluate.

answer:
Provide a detailed guide for answering the question.

The answer should include:

- Core concept
- Important technical points
- Candidate-specific context
- Example where appropriate
- Trade-offs where relevant
- Common mistakes to avoid
- How the candidate should structure the response

Do NOT simply provide a one-line answer.

============================================================
4. BEHAVIORAL INTERVIEW QUESTIONS
============================================================

Generate at least 5 behavioral interview questions.

Questions must be relevant to the candidate's:

- Projects
- Internship/work experience
- Teamwork
- Leadership
- Problem solving
- Failures
- Challenges
- Conflicts
- Deadlines
- Learning ability
- Adaptability
- Target job role

Each behavioral question MUST be an object containing:

question:
The exact behavioral interview question.

intention:
Explain what the interviewer is evaluating.

answer:
Provide a recommended structure for answering.

Where appropriate, use the STAR framework:

Situation
Task
Action
Result

The answer should help the candidate understand:

- What story to use
- What details to mention
- What details to avoid
- How to demonstrate impact
- How to connect the story to the target role

Do NOT fabricate experiences that are not present in the resume.

============================================================
5. PROJECT DEEP-DIVE QUESTIONS
============================================================

Identify the candidate's most relevant projects.

Generate at least 3 project-specific interview questions.

These questions should investigate:

- Why the project was built
- Architecture
- Technology choices
- Database design
- API design
- Authentication
- Authorization
- Error handling
- Performance
- Scalability
- Security
- Deployment
- Challenges
- Trade-offs
- Future improvements

Questions must be specific to the candidate's actual projects.

If the candidate has a project using a specific technology,
interview questions should test whether the candidate genuinely
understands how that technology was used.

============================================================
6. SKILL GAPS
============================================================

Identify at least 3 meaningful skill gaps.

Prefer 4-6 gaps when sufficient evidence exists.

Skill gaps must be based on the difference between:

Candidate's current demonstrated abilities

AND

Target job requirements.

Each skill gap MUST contain:

skill:
The specific missing or weak skill.

severity:
Must be exactly one of:

"low"
"medium"
"high"

Interpret severity as:

high:
Important requirement for the target role that is missing or weak.

medium:
Useful/important skill where the candidate has limited evidence
or needs stronger practical knowledge.

low:
Minor gap or relatively easy improvement.

Do NOT list random technologies.

Every skill gap should be relevant to the target role.

============================================================
7. PREPARATION PLAN
============================================================

Create a detailed 7-day interview preparation plan.

The plan must prioritize the candidate's actual weaknesses and
the requirements of the target role.

Each day MUST contain:

day
focus
tasks

Each day must contain at least 3 specific tasks.

Tasks should be actionable rather than vague.

BAD:

"Study React."

GOOD:

"Review React rendering, reconciliation, hooks, memoization, and
identify two performance improvements that could be applied to
the candidate's existing project."

The 7-day plan should generally progress from:

Day 1:
Resume + job description analysis

Day 2:
Core technical fundamentals

Day 3:
Candidate projects deep dive

Day 4:
Job-specific technical skills

Day 5:
DSA/problem solving

Day 6:
Behavioral + mock interview

Day 7:
Full revision + final mock interview

You may modify this sequence if the candidate's skill gaps indicate
a better preparation strategy.

============================================================
8. RESUME DEFENSE
============================================================

Identify claims from the resume that an interviewer is likely to
question deeply.

For example:

- Technologies listed without strong project evidence
- Large performance claims
- Architecture claims
- Leadership claims
- Quantified achievements
- Advanced technologies
- Complex projects
- Security claims

Generate interview questions that could verify whether the candidate
actually understands these claims.

============================================================
9. INTERVIEWER FOLLOW-UP QUESTIONS
============================================================

For important technical/project questions, think like a real
interviewer.

Include follow-up questions inside the answer where useful.

The goal is to prepare the candidate for:

initial question
-> candidate answer
-> interviewer follow-up
-> deeper follow-up

The preparation should therefore test understanding rather than
memorization.

============================================================
10. DIFFICULTY DISTRIBUTION
============================================================

Technical questions should have a realistic difficulty progression:

- Beginner/fundamental
- Intermediate
- Advanced
- Project-specific
- Scenario-based
- Architecture/design

Do not make every question extremely difficult.

============================================================
11. PERSONALIZATION RULE
============================================================

Every major section must reference the candidate's actual profile.

Avoid generic statements such as:

"You should learn more about backend development."

Instead write conceptually specific recommendations such as:

"Your Node.js project demonstrates API development, but the resume
does not provide strong evidence of rate limiting, caching, or
production error handling. These are relevant gaps for a backend
role."

Only make such statements when supported by the supplied information.

============================================================
12. HONESTY RULE
============================================================

Never fabricate:

- Work experience
- Projects
- Technologies
- Achievements
- Certifications
- Responsibilities
- Metrics
- Interview experience

If information is unavailable, explicitly treat it as unknown or
unverified.

============================================================
13. OUTPUT QUALITY
============================================================

The report should be:

- Specific
- Practical
- Technically accurate
- Interview-oriented
- Personalized
- Actionable
- Detailed
- Realistic

The candidate should be able to use the report directly as an
interview preparation guide.

============================================================
IMPORTANT JSON RULES
============================================================

Return ONLY valid structured JSON matching the provided response
schema.

Do NOT return markdown.

Do NOT return explanations outside the JSON.

Do NOT wrap the JSON inside a markdown code block.

Do NOT return technical questions as strings.

Do NOT return behavioral questions as strings.

Do NOT return project questions as strings.

Do NOT return skill gaps as strings.

Do NOT return preparation plan days as strings.

Every technical question MUST contain:

question
intention
answer

Every behavioral question MUST contain:

question
intention
answer

Every project question MUST contain:

question
intention
answer

Every skill gap MUST contain:

skill
severity

Every preparation plan item MUST contain:

day
focus
tasks

Do NOT return empty arrays.

Ensure all required fields are populated.

Ensure matchScore is a number between 0 and 100.

Ensure severity is ONLY:

low
medium
high

Ensure day represents the correct preparation day.

Ensure tasks is an array of actionable task strings.

The final response MUST be valid JSON that can be parsed directly
using JSON.parse().
`;

  // ===============================
  // GEMINI REQUEST
  // ===============================

  const response = await generateWithRetry({
    model: "gemini-3.5-flash-lite",

    contents: prompt,

    config: {
      responseMimeType: "application/json",

      responseSchema: {
        type: "OBJECT",

        properties: {
          matchScore: {
            type: "NUMBER",
          },

          technicalQuestions: {
            type: "ARRAY",

            items: {
              type: "OBJECT",

              properties: {
                question: {
                  type: "STRING",
                },

                intention: {
                  type: "STRING",
                },

                answer: {
                  type: "STRING",
                },
              },

              required: ["question", "intention", "answer"],
            },
          },

          behavioralQuestions: {
            type: "ARRAY",

            items: {
              type: "OBJECT",

              properties: {
                question: {
                  type: "STRING",
                },

                intention: {
                  type: "STRING",
                },

                answer: {
                  type: "STRING",
                },
              },

              required: ["question", "intention", "answer"],
            },
          },

          skillGaps: {
            type: "ARRAY",

            items: {
              type: "OBJECT",

              properties: {
                skill: {
                  type: "STRING",
                },

                severity: {
                  type: "STRING",
                },
              },

              required: ["skill", "severity"],
            },
          },

          preparationPlan: {
            type: "ARRAY",

            items: {
              type: "OBJECT",

              properties: {
                day: {
                  type: "INTEGER",
                },

                focus: {
                  type: "STRING",
                },

                tasks: {
                  type: "ARRAY",

                  items: {
                    type: "STRING",
                  },
                },
              },

              required: ["day", "focus", "tasks"],
            },
          },
        },

        required: [
          "matchScore",
          "technicalQuestions",
          "behavioralQuestions",
          "skillGaps",
          "preparationPlan",
        ],
      },
    },
  });

  // ===============================
  // PARSE AI RESPONSE
  // ===============================


  let report;

  try {
    report = JSON.parse(response.text);
  } catch (error) {
    console.error("Failed to parse Gemini response:");
    console.error(response.text);

    throw new Error("AI returned an invalid JSON response");
  }

  // ===============================
  // VALIDATE WITH ZOD
  // ===============================

  const validatedReport = interviewReportSchema.parse(report);

  console.dir(validatedReport, {
    depth: null,
  });

  return validatedReport;
}

module.exports = generateInterviewReport;
