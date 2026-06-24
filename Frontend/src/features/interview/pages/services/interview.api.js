import axios from "axios";
const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials:true
})

/**
 * @description Service to generate interview report based on user seld description, resume and job Description.
 */
export const generateInterviewReport = async  ({ jobDescription, selfDescription, resumeFile}) =>{
    const formData = new FormData()             //we create FormData to send file from frontend to backend
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    formData.append("resume", resumeFile)

    console.log(resumeFile)
    console.log(formData.get("resume"))

    const response = await api.post("/api/interview",formData,{
        headers:{
            "Content-Type": "multipart/form-data" //because of file upload)
        }
    })

    return response.data

}

/**
 * @description Service to get interview report by interviewId
 */
export const getInterviewReportById = async (interviewId) =>{
    const response = await api.get(`/api/interview/report/${interviewId}`)

    return response.data
}

/**
 * @description Service to get all interview reports of logged in user.
 */
export const getAllInterviewReports = async ()=>{
    const response = await api.get("/api/interview")

    return response.data
}

/**
 * @description Service to generate resume PDF based on user self description, resume and job description. The PDF is generated in backend using puppeteer and sent as a blob to frontend for download.
 */
export const generateResumePdf = async ({ interviewReportId }) => {
    // console.log("interviewReportId =", interviewReportId)
    const response = await api.post(
        `/api/interview/resume/pdf/${interviewReportId}`,
        {}, // empty body
        {
            responseType: "blob"
        }
    );

    return response
}