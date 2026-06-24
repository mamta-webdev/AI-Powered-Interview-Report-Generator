const pdfParseModule = require("pdf-parse")
const {generateInterviewReport , generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../modals/interviewReport.modal")

const pdfParse =
  typeof pdfParseModule === "function" ? pdfParseModule : pdfParseModule?.default

async function extractPdfTextFromBuffer(buffer) {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error("Invalid PDF buffer.")
  }

  // pdf-parse v1 style (CJS function/default function)
  if (typeof pdfParse === "function") {
    const parsed = await pdfParse(buffer)
    return parsed?.text?.trim() || ""
  }

  // pdf-parse v2 style (PDFParse class export)
  const PDFParseClass = pdfParseModule?.PDFParse || pdfParseModule?.default?.PDFParse
  if (typeof PDFParseClass === "function") {
    const parser = new PDFParseClass({ data: buffer })
    const parsed = await parser.getText()
    if (typeof parser.destroy === "function") {
      await parser.destroy()
    }
    return parsed?.text?.trim() || ""
  }

  throw new Error("Unsupported pdf-parse export format.")
}

/**
 * @description: controller to generate interview report based on user self Description, resume and job description
 */
async function generateInterviewReportController(req,res){
    try {
    const { selfDescription = "", jobDescription = "" } = req.body || {}

    if (!jobDescription || !jobDescription.trim()) {
    return res.status(400).json({
        message: "Job description is required."
    })
}
    let resumeContent = ""

    if (req.file) {
        if (!req.file.buffer) {
            return res.status(400).json({
                message:"Uploaded file is missing buffer. Ensure multer memoryStorage is configured."
            })
        }
        resumeContent = await extractPdfTextFromBuffer(req.file.buffer)
        console.log("EXTRACTED RESUME TEXT:\n", resumeContent)
    }

    if (!resumeContent && !selfDescription) {
        return res.status(400).json({
            message:"Either resume or selfDescription is required."
        })
    }

    const interviewReportByAi =  await generateInterviewReport({
        resume:resumeContent,
        selfDescription,
        jobDescription
    })

    const fallbackTitle =
      typeof jobDescription === "string" && jobDescription.trim()
        ? jobDescription.trim().split("\n")[0].slice(0, 120)
        : "Interview Report"

    const safeTitle =
      typeof interviewReportByAi?.title === "string" && interviewReportByAi.title.trim()
        ? interviewReportByAi.title.trim()
        : fallbackTitle

        console.log("AI RESPONSE =", interviewReportByAi);
    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent,
        selfDescription,
        jobDescription,
        title: safeTitle,
        ...interviewReportByAi
    })

    res.status(201).json({
        message:"Interview report generated successfully.",
        interviewReport
    })
    } catch (error) {
        return res.status(500).json({
            message:"Failed to generate interview report.",
            error:error.message
        })
    }
}

/**
 * @description: controller to get interview report by interview id
 */
async function getInterviewReportByIdController(req,res){
    const { interviewId } = req.params
    const interviewReport = await interviewReportModel.findById(interviewId)

    // console.log(req.user)
    // console.log("REQUESTED ID:", interviewId)

    if(!interviewReport){
        return res.status(404).json({
            message:"Interview report not found."
        })
    }
    res.status(200).json({
        message:"Interview Report fetched successfully.",
        interviewReport
    })
}

/**
 * @description controller to get all interview reports of logged in user
 */
async function getAllInterviewReportsController(req,res){
    console.log("req.user =", req.user)
    console.log("req.user.id =", req.user.id)
    console.log("req.user._id =", req.user._id)
    const interviewReports = await interviewReportModel.find({ user: req.user.id}).sort({ createdAt:-1}).select("-resume -selfDescription -jobDescription -_v -technicalQuestions -behaviouralQuestions -preparationPlan")

     console.log("Reports Found:", interviewReports.length)

    res.status(200).json({
        message:"Interview reports fetched successfully",
        interviewReports
    })
}

/**
 * @description controller to generate resume PDF from user self Description, resume and job description
 */
async function generateResumePdfController(req,res){
    const { interviewReportId } = req.params 
    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if(!interviewReport){
        return res.status(404).json({
            message:"Interview report not found."
        })
    }
    const {resume, jobDescription, selfDescription} = interviewReport

    const pdfBuffer = await generateResumePdf({resume, jobDescription, selfDescription})

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume-${interviewReportId}.pdf`
    })
    res.send(pdfBuffer)
     
    // console.log("PDF SIZE:", pdfBuffer.length);
    // console.log("TYPE:", typeof pdfBuffer)
    // console.log("CONSTRUCTOR:", pdfBuffer?.constructor?.name)
    // console.log("PDF BUFFER:", pdfBuffer)
}

module.exports = {generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController}
