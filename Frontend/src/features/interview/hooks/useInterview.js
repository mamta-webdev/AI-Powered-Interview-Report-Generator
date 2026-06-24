import {getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../pages/services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"


export const useInterview = () =>{
    const context = useContext(InterviewContext)
    const { interviewId } = useParams()
    console.log("interviewId =", interviewId)

    if(!context){
        throw new Error("useInterview must be usedd within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    
    const generateReport = async ({jobDescription, selfDescription, resumeFile}) =>{

        setLoading(true)
        let response = null
        try{
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile})
            setReport(response.interviewReport)
        }catch(err){
            const message = err?.response?.data?.error || err?.response?.data?.message || err.message
            console.log("Generate report failed:", message)
            throw new Error(message)
        }finally{
            setLoading(false)
        }

        return response.interviewReport
    }

    const getReportById = async (interviewId) =>{
        setLoading(true)
        let response = null
        try{
            response = await getInterviewReportById(interviewId)
            console.log("FULL API RESPONSE:", response)
            setReport(response?.interviewReport)
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
        return response?.interviewReport
    }

    const getReports = async () =>{
        setLoading(true)
        let response = null
        try{
            response = await getAllInterviewReports()
             console.log("API RESPONSE:", response)
            setReports(response.interviewReports)
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
        return response.interviewReports
    }

    const getResumePdf = async ({ interviewReportId })=>{
        console.log("interviewReportId =", interviewReportId)
        setLoading(true)
        let response = null
        try{
            response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([ response.data ], { type:"application/pdf"} ))
            const link = document.createElement("a")
            link.href= url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
        }
        catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        console.log("INTERVIEW ID:", interviewId)
        if(interviewId){
            console.log("CALLING GET REPORT")
            getReportById(interviewId)
        }else{
            console.log("NO INTERVIEW ID")
            getReports()
        }
    }, [interviewId])

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf}


}
