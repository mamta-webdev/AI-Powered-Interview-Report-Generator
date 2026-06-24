// const { GoogleGenAI } = require("@google/genai")
const Groq = require("groq-sdk");
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

// const ai = new GoogleGenAI({
//     apiKey: process.env.GOOGLE_GENAI_API_KEY
// })
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const interviewReportSchema = z.object({
   matchScore: z.number().min(0).max(100)
  .describe("A score from 0 to 100 indicating how well the candidate matches the job"),

    technicalquestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer:z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intentiona and how to answer them."),

    behaviouralquestions: z.array(z.object({
        question: z.string().describe("The behavioural question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer:z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioural questions that can be asked in the interview along with their intention and how to answer them."),

    skillGap: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium" , "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job")
    })).describe("List of skills which the candidate is lacking along with their severity level indicating their impact on job suitability"),


    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g.data structures, system design, mock interviews"),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g read a specific book or some other suggestions")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),

    title: z.string().describe("The title of the job for which the interview report is generated."),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }){

    const prompt = `
You are an AI that returns ONLY STRICT JSON.

Follow this EXACT structure and DO NOT change anything:

{
  "matchScore": 0,
  "title": "string",
  "technicalquestions": [
    {
      "question": "string",
      "intention": "string",
      "answer": "string"
    }
  ],
  "behaviouralquestions": [
    {
      "question": "string",
      "intention": "string",
      "answer": "string"
    }
  ],
  "skillGap": [
    {
      "skill": "string",
      "severity": "low | medium | high"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "string",
      "tasks": ["string"]
    }
  ]
}

STRICT RULES:
- DO NOT rename any keys
- DO NOT change key spelling or casing
- DO NOT skip any field
- DO NOT add extra fields
- DO NOT return anything except JSON
- "matchScore" must be a number between 0 and 100
- "title" is required and must be a short job title like "Senior Frontend Engineer"
- "technicalquestions" and "behaviouralquestions" must follow question → intention → answer order
- "skillGap" must use key "skill" (NOT skills)
- "severity" must be exactly one of: low, medium, high
- "preparationPlan.tasks" must be an array of strings
- Each "tasks" array MUST contain at least 3 detailed tasks
- Do NOT return empty arrays
---
- Generate AT LEAST 5 technicalquestions
- Generate AT LEAST 5 behaviouralquestions
- Generate AT LEAST 7 preparationPlan days
- Each preparationPlan day must contain AT LEAST 5 detailed tasks
- Make responses detailed(appropriately) and professional
- Do not shorten the response

Now generate the report using:

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}
`
    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
              {
              role: "user",
              content: prompt,
            },
        ],
});

const output = response.choices[0].message.content;

console.log("RAW RESPONSE:\n", output);

const cleanedOutput = output
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

const data = JSON.parse(cleanedOutput);

// ✅ USE data
console.log(data.preparationPlan[0].tasks);

console.log(JSON.stringify(data, null, 2));

return data;
}

async function generatePdfFromHtml(htmlContent) {

  const browser = await puppeteer.launch({
    headless: true,
  });

  const page = await browser.newPage();

  // Better rendering settings
  await page.setViewport({
    width: 1400,
    height: 1800,
    deviceScaleFactor: 2,
  });


  await page.setContent(htmlContent, {
    waitUntil: "domcontentloaded",
    timeout: 0,
  });

  // Better PDF quality
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    margin: {
      top: "18mm",
      right: "18mm",
      bottom: "18mm",
      left: "18mm",
    },
  });

  await browser.close();

  // return pdfBuffer;
  return Buffer.from(pdfBuffer);
}

async function generateResumePdf({
  resume,
  selfDescription,
  jobDescription
}) {

  try {

     const prompt = `
You are an expert ATS resume writer.

Using the candidate resume, self description, and target job description:

- create a professional ATS-friendly resume
- improve wording and clarity
- tailor content for the target role
- preserve factual accuracy
- do not invent fake information
- keep the tone natural and human-written
- emphasize relevant skills and projects
- use concise impactful bullet points

Return clean semantic HTML only.

Requirements:
- single-column layout
- proper section hierarchy
- no tables
- no images
- no SVGs
- no external CSS
- no JavaScript
- no markdown

Sections to include if available:
- Summary
- Skills
- Projects
- Experience
- Education
- Certifications

Candidate Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
    `;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.2,
      messages: [
        {
          role: "user",
          content: prompt,
        }
      ]
    });

    let html = response.choices[0].message.content;

    html = html
      .replace(/```html/g, "")
      .replace(/```/g, "")
      .trim();

     const fs = require("fs"); 
    fs.writeFileSync("resume.html", html);

    const pdfBuffer = await generatePdfFromHtml(html);

    return pdfBuffer;

  } catch (error) {

    console.error("Resume Generation Error:", error);

    if (error.status === 429) {
      throw new Error(
        "AI service is temporarily busy. Please try again later."
      );
    }

    throw new Error("Failed to generate resume.");
  }
}

module.exports = {generateInterviewReport, generateResumePdf}

//Ai se html generate krvayenge and puppeteer package html ko PDf me convert kr dega and server se us pdf ko bhej denge client ko to download
