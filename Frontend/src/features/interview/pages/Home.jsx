import React from 'react'
import "../style/home.scss"
import { useInterview } from "../hooks/useInterview"
import { useState, useRef,  } from 'react'
import { useNavigate } from "react-router"
import { toast } from "react-hot-toast";

const Home = () => {
  const {loading, generateReport, reports} = useInterview()
  const [ jobDescription, setjobDescription ] = useState();
  const [ selfDescription, setSelfDescription ] = useState();
  const [isGenerating, setIsGenerating] = useState(false);
  const resumeInputRef = useRef()

  const navigate = useNavigate()

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0]

    if (!jobDescription?.trim()) {
        toast.error("Please enter a job description",{
          id:"interview-validation"
        })
        return;
    }

    if (!resumeFile && !selfDescription?.trim()) {
        toast.error("Please upload a resume or enter a self description",{
          id: "interview-validation"
        })
        return;
    }
    try {
    setIsGenerating(true);

    const data = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
    });

    if (!data || !data._id) {
      console.error("Invalid response:", data);
      return;
    }

    navigate(`/interview/${data._id}`);
  } finally {
    setIsGenerating(false);
  }
};
  if(isGenerating){
    return (
      
      <main
  className="loading-screen"
  style={{
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #6b46c1 100%)",
    color: "#ffffff",
    textAlign: "center",
  }}
>
  <h1
    style={{
      fontSize: "2rem",
      fontWeight: "700",
      letterSpacing: "0.5px",
      textShadow: "0 4px 12px rgba(0,0,0,0.25)",
    }}
  >
    🚀 Generating Your Interview Plan...
  </h1>
     </main>
    )
  }
 console.log("Reports:", reports);
  return (
    <main className="home">
      <section className="home__container">
        <header className="hero">
          <h1>
            Create Your Custom <span className="highlight">Interview Plan</span>
          </h1>
          <p>
            Let our AI analyze the job requirements and your unique profile to
            build a winning strategy.
          </p>
        </header>

        <div className="interview-input-group">
          <div className="left panel">
            <label htmlFor="jobDescription">Target Job Description</label>
            <textarea
              onChange={(e)=>{setjobDescription(e.target.value)}}
              name="jobDescription"
              id="jobDescription"
              placeholder="Paste the full job description here..."
              maxLength={1500}
            />
            <small className="char-count">0 / 1500 chars</small>
          </div>

          <div className="right panel">
            <div className="input-group">
              <p className="group-title">Your Profile</p>
              <label className="sub-label" htmlFor="resume">
                Upload Resume
              </label>
              <label className="upload-box" htmlFor="resume">
                <span className="upload-icon">⬆</span>
                <span>Click to upload or drag & drop</span>
                <small>PDF or DOCX, Max. 5MB</small>
              </label>
              <input ref={resumeInputRef} hidden type="file" name="resume" id="resume" accept=".pdf,.doc,.docx" />
            </div>

            <p className="or-separator">OR</p>

            <div className="input-group">
              <label className="sub-label" htmlFor="selfDescription">
                Quick Self Description
              </label>
              <textarea
                onChange={(e)=>{setSelfDescription(e.target.value)}}
                name="selfDescription"
                id="selfDescription"
                placeholder="Briefly describe your experience, key skills, and years of experience..."
              />
            </div>

            <p className="info-note">
              Either a Resume or a Self Description is required to generate a
              personalized plan.
            </p>

            <button onClick={handleGenerateReport} className="primary-btn">Generate My Interview Strategy</button>
            </div> {/* close right.panel */}
        </div>
  
          <div className="recent-reports">
               <h2>Recent Interview Reports</h2>

            <ul>
  {reports?.length === 0 ? (
    <li>No recent reports found.</li>
  ) : (
    reports?.map((report) => {
      const date = new Date(report.createdAt);
      return (
        <li
          key={report._id}
          onClick={() => navigate(`/interview/${report._id}`)}
        >
          <h3>{report.title}</h3>

          <p className="report-date">
            {date.toLocaleDateString()}{" "}
            {date.toLocaleTimeString()}
          </p>
        </li>
      );
    })
  )}
</ul>
</div>

      </section>
    </main>
  )
}

export default Home
