const express = require("express");
const AuthMiddleware = require("../middleware/auth.middleware")
const interviewController = require("../controller/interview.controller")
const upload = require("../middleware/file.middleware")

const interviewRouter = express.Router()


/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description,resume pdf and job Description.
 * @access Private
 */
interviewRouter.post("/",AuthMiddleware.authUser,upload.single("resume"), interviewController.generateInterviewReportController ) //this authUser middleware forward the request if a logged in user comes

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId
 * @access private
 */
interviewRouter.get("/report/:interviewId",AuthMiddleware.authUser,interviewController.getInterviewReportByIdController)

/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user
 * @access private
 */
interviewRouter.get("/",AuthMiddleware.authUser,interviewController.getAllInterviewReportsController)

/**
 * @route POST /api/interview/resume/pdf
 * @description generate resume PDF on the basis of user self description resume content and job description
 * @access private
 */

interviewRouter.post("/resume/pdf/:interviewReportId", AuthMiddleware.authUser, interviewController.generateResumePdfController)


module.exports = interviewRouter