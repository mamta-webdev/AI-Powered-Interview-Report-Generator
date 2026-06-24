import React, { useMemo, useState, useEffect } from "react"
import "../style/interview.scss"
import { useInterview } from "../hooks/useInterview"
import { useNavigate, useParams } from "react-router"

// const report = {
//   matchScore: 85,
//   technicalquestions: [
//     {
//       question: "Can you explain the concept of the virtual DOM in React and why it's beneficial?",
//       intention:
//         "To assess understanding of React's core rendering mechanism and performance optimizations.",
//       answer:
//         "The virtual DOM is a programming concept where a virtual representation of a UI is kept in memory and synced with the real DOM.",
//     },
//     {
//       question: "Describe how you would handle asynchronous operations in Node.js.",
//       intention: "To gauge knowledge of asynchronous programming patterns in Node.js.",
//       answer:
//         "In Node.js, asynchronous operations are handled using callbacks, Promises, or async/await.",
//     },
//     {
//       question: "What is the difference between SQL and NoSQL databases?",
//       intention: "To evaluate understanding of database concepts and design choices.",
//       answer:
//         "SQL is relational and schema-first; NoSQL is flexible and scales horizontally for many modern use cases.",
//     },
//   ],
//   behaviouralquestions: [
//     {
//       question: "Describe a challenging technical problem you faced in a project.",
//       intention: "To assess practical problem-solving and resilience.",
//       answer:
//         "I optimized performance by profiling bottlenecks, lazy loading assets, and improving render efficiency.",
//     },
//     {
//       question: "How do you stay updated with trends in web development?",
//       intention: "To gauge consistency in learning and growth.",
//       answer:
//         "I follow trusted blogs, newsletters, and practice new tools in side projects.",
//     },
//   ],
//   skillGap: [
//     { skill: "Redux", severity: "low" },
//     { skill: "Tailwind CSS", severity: "low" },
//     { skill: "JWT/OAuth", severity: "low" },
//     { skill: "Deployment Platforms", severity: "medium" },
//     { skill: "Agile methodologies", severity: "low" },
//   ],
//   preparationPlan: [
//     {
//       day: 1,
//       focus: "Node.js Internals & Streams",
//       tasks: [
//         "Deep dive into the Event Loop phases and process.nextTick vs setImmediate.",
//         "Practice implementing Node.js streams for handling large data sets.",
//       ],
//     },
//     {
//       day: 2,
//       focus: "Advanced MongoDB & Indexing",
//       tasks: [
//         "Study compound indexes, TTL indexes, and text indexes.",
//         "Practice writing complex aggregation pipelines and using explain() for optimization.",
//       ],
//     },
//     {
//       day: 3,
//       focus: "Caching & Redis Strategies",
//       tasks: [
//         "Read about Redis data types beyond strings such as sets, hashes, and sorted sets.",
//         "Implement a Redis-based rate limiter or a caching layer for a sample API.",
//       ],
//     },
//     {
//       day: 4,
//       focus: "System Design & Microservices",
//       tasks: [
//         "Study microservice communication patterns, synchronous vs asynchronous.",
//         "Learn API gateway and circuit breaker patterns with real examples.",
//       ],
//     },
//     {
//       day: 5,
//       focus: "Message Queues & DevOps Basics",
//       tasks: [
//         "Watch introductory tutorials on RabbitMQ or Kafka.",
//         "Dockerize a project and write a simple GitHub Actions workflow for CI.",
//       ],
//     },
//     {
//       day: 6,
//       focus: "Data Structures & Algorithms",
//       tasks: [
//         "Solve 5 to 10 medium problems focused on arrays, strings, and hash maps.",
//         "Review common sorting and searching algorithms for interviews.",
//       ],
//     },
//     {
//       day: 7,
//       focus: "Mock Interviews & Final Revision",
//       tasks: [
//         "Take one full technical mock and one behavioral mock interview.",
//         "Create a one-page revision sheet for system design, API security, and key projects.",
//       ],
//     },
//   ],
// }

const Interview = () => {
  const [activeSection, setActiveSection] = useState("technical")
  const { report, getReportById, loading, getResumePdf } = useInterview()
  const { interviewId } = useParams()

  const sectionContent = useMemo(() => {
    if (!report) return [];
    if (activeSection === "technical") {
      return report.technicalquestions.map((item, index) => ({
        id: `tq-${index + 1}`,
        title: item.question,
        subtitle: item.intention,
        body: item.answer,
      }))
    }
    if (activeSection === "behavioral") {
      return report.behaviouralquestions.map((item, index) => ({
        id: `bq-${index + 1}`,
        title: item.question,
        subtitle: item.intention,
        body: item.answer,
      }))
    }
    return report.preparationPlan.map((item) => ({
      id: `day-${item.day}`,
      day: item.day,
      title: item.focus,
      tasks: item.tasks,
    }))
  }, [activeSection,report])

  console.log("REPORT:", report)
  console.log("LOADING:", loading)
  if(loading || !report){
    return(
      <main className="loading-screen">
        <h1>Loading your plan....</h1>
        </main>
    )
  }

  const sectionTitle =
    (activeSection === "technical" && "Technical Questions") ||
    (activeSection === "behavioral" && "Behavioral Questions") ||
    "Road Map"

  return (
    <main className="interview-page">
      <section className="interview-layout">
        <div className="interview-shell">
          <aside className="left-nav panel">
            <p className="panel-label">Sections</p>
            <button
              className={activeSection === "technical" ? "nav-item active" : "nav-item"}
              onClick={() => {
                setActiveSection("technical")
              }}
            >
              Technical questions
            </button>
            <button
              className={activeSection === "behavioral" ? "nav-item active" : "nav-item"}
              onClick={() => {
                setActiveSection("behavioral")
              }}
            >
              Behavioral questions
            </button>
            <button
              className={activeSection === "roadmap" ? "nav-item active" : "nav-item"}
              onClick={() => {
                setActiveSection("roadmap")
              }}
            >
              Road Map
            </button>
            <button onClick={() => 
               {getResumePdf({ interviewReportId: report._id })}} 

              style={{background:"#cf1040"}} className="button primary-btn">
              <svg height={"0.6rem"} style={{marginRight:"0.4rem"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
              Download Resume</button>
          </aside>

          <section className="main-content panel">
            <div className="content-topbar">
              <h2 className="content-heading">{sectionTitle}</h2>
              <span className="count-badge">
                {activeSection === "roadmap"
                  ? `${sectionContent.length}-day plan`
                  : `${sectionContent.length} questions`}
              </span>
            </div>

            {activeSection !== "roadmap" ? (
              <div className="content-list">
                {sectionContent.map((item, index) => (
                  <article className="content-card static-card" key={item.id}>
                    <h3>
                      <span className="question-index">{`Q${index + 1}`}</span>
                      {item.title}
                    </h3>
                    <p className="intent-label">Intention</p>
                    <p className="intent">{item.subtitle}</p>
                    <p className="answer-label">Model Answer</p>
                    <p>{item.body}</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="roadmap-list">
                {sectionContent.map((item) => (
                  <article className="roadmap-item" key={item.id}>
                    <div className="roadmap-node" />
                    <div className="roadmap-content">
                      <h3>
                        <span className="roadmap-day">{`Day ${item.day}`}</span>
                        {item.title}
                      </h3>
                      <ul>
                        {item.tasks.map((task) => (
                          <li key={`${item.id}-${task}`}>{task}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className="right-panel panel">
            <p className="panel-label">Match Score</p>
            <div className="score-ring">
              <span>{report.matchScore}</span>
            </div>
            <p className="score-note">Strong match for this role</p>
            <p className="panel-label">Skill Gaps</p>
            <div className="chips">
              {report.skillGap.map((item, index) => (
                <span
                  key={item.skill}
                  className={`chip ${item.severity === "medium" ? "medium" : ""} skill-${index + 1}`}
                >
                  {item.skill}
                </span>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default Interview
