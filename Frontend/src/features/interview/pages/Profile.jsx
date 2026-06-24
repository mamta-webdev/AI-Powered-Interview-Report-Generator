import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/use.Auth";
import { getAllInterviewReports } from "./services/interview.api";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Dashboard", path: "/dashboard", icon: "ti-layout-dashboard" },
  { label: "Generate Report", path: "/", icon: "ti-sparkles" },
  { label: "My Reports", path: "/reports", icon: "ti-file-description" },
  { label: "Profile", path: "/profile", icon: "ti-user" },
  { label: "Settings", path: "/settings", icon: "ti-settings" },
];

function scoreStyle(score) {
  if (score >= 80) return { bg: "#D1FAE5", color: "#065F46" };
  if (score >= 70) return { bg: "#FEF3C7", color: "#92400E" };
  return { bg: "#FEE2E2", color: "#991B1B" };
}

function ReadinessRing({ value }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div style={{ position: "relative", width: 90, height: 90, flexShrink: 0 }}>
      <svg width="90" height="90" viewBox="0 0 90 90">
        <circle cx="45" cy="45" r={r} fill="none" stroke="#1E293B" strokeWidth="7" />
        <circle
          cx="45" cy="45" r={r} fill="none"
          stroke="#7C3AED" strokeWidth="7"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 45 45)"
          style={{ transition: "stroke-dashoffset 1.2s ease" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: 17, fontWeight: 700, color: "#F8FAFC" }}>{value}%</span>
      </div>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const { user, handleLogOut } = useAuth();

  console.log("USER DATA =", user);
  
   useEffect(() => {
  const fetchReports = async () => {
    try {
      const data = await getAllInterviewReports();
      setReports(data.interviewReports || []);
    } catch (error) {
      console.log(error);
    }
  };

  fetchReports();
}, []);

  console.log("REPORTS =", reports);
  console.log("FIRST REPORT =", reports[0]);

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "MA";

  const onLogout = async () => {
    await handleLogOut();
    navigate("/login");
  };

  const avgScore =
  reports.length > 0
    ? Math.round(
        reports.reduce(
          (sum, report) => sum + (report.matchScore || 0),
          0
        ) / reports.length
      )
    : 0;

  const bestScore =
  reports.length > 0
    ? Math.max(...reports.map(r => r.matchScore || 0))
    : 0;


  const latestReport = reports[0];
  const skillGaps = latestReport?.skillGap || [];

 console.log("LATEST REPORT =", latestReport);
 console.log("SKILL GAPS =", skillGaps);

 const getSkillRecommendation = (skillName) => {
  const skill = skillName.toLowerCase();

  if (skill.includes("java")) {
    return "Focus on OOP concepts, Collections Framework, Exception Handling, and building small Java projects.";
  }

  if (skill.includes("database") || skill.includes("sql")) {
    return "Practice complex SQL queries, joins, indexing, normalization, and database design concepts.";
  }

  if (skill.includes("react")) {
    return "Strengthen React fundamentals including hooks, state management, component architecture, and API integration.";
  }

  if (skill.includes("javascript")) {
    return "Improve ES6 concepts, async programming, DOM manipulation, closures, and array methods.";
  }

  if (skill.includes("html")) {
    return "Work on semantic HTML, accessibility, forms, and responsive page structures.";
  }

  if (skill.includes("css")) {
    return "Practice Flexbox, Grid, responsive design, animations, and modern UI layouts.";
  }

  if (skill.includes("node")) {
    return "Learn REST APIs, authentication, middleware, error handling, and backend architecture.";
  }

  if (skill.includes("mongodb")) {
    return "Improve schema design, aggregation pipelines, indexing, and query optimization.";
  }

  if (skill.includes("express")) {
    return "Focus on routing, middleware, authentication, API design, and error handling.";
  }

  if (skill.includes("communication")) {
    return "Practice explaining technical concepts clearly, mock interviews, and structured responses.";
  }

  if (skill.includes("problem")) {
    return "Solve coding challenges regularly and focus on logical thinking and optimization techniques.";
  }

  return "Continue practicing this skill through projects, interview questions, and real-world applications.";
};
  return (
    <div style={s.shell}>

      {/* ── Sidebar ── */}
      <aside style={s.sidebar}>
        <div style={s.brand}>
          <div style={s.brandIco}>AI</div>
          <div>
            <div style={s.brandTitle}>AI Interview</div>
            <div style={s.brandSub}>Report Generator</div>
          </div>
        </div>

        <nav style={s.nav}>
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => navigate(link.path)}
              style={{
                ...s.navBtn,
                ...(link.path === "/profile" ? s.navActive : {}),
              }}
            >
              <i className={`ti ${link.icon}`} style={{ fontSize: 16 }} aria-hidden="true" />
              {link.label}
            </button>
          ))}
        </nav>

        <button onClick={onLogout} style={s.sideLogout}>
          <i className="ti ti-logout" style={{ fontSize: 15, color: "#EF4444" }} aria-hidden="true" />
          Logout
        </button>
      </aside>

      {/* ── Main ── */}
      <div style={s.main}>

        {/* Topbar */}
        <header style={s.topbar}>
           <div style={s.pageTitleRow}>
         <h1 style={s.pageTitle}>
              My Profile
           </h1>

            <p style={s.pageSub}>
           Manage your account and view your interview progress
         </p>
       </div>
         <div style={{ flex: 1 }}></div>
          <div style={s.topRight}>
            <button style={s.bellBtn}>
              <i className="ti ti-bell" style={{ fontSize: 18, color: "#64748B" }} aria-hidden="true" />
            </button>
            <div style={s.userChip}>
              <div style={s.chipAv}>{initials}</div>
              <div>
                <div style={s.chipName}>{user?.username || "maahi"}</div>
                <div style={s.chipBadge}>Premium</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page body — dark background, full height */}
        <div style={s.pageBody}>


          {/* Content grid */}
          <div style={s.grid}>

            {/* ── LEFT: dark identity card ── */}
            <div style={s.darkCard}>

              {/* Avatar */}
              <div style={s.avatarSection}>
                <div style={s.avatarWrap}>
                  <div style={s.avatarCircle}>{initials}</div>
                  <div style={s.onlineDot} />
                </div>
                <p style={s.idName}>{user?.username || "maahi"}</p>
                <p style={s.idEmail}>{user?.email || "maahi@maahi.com"}</p>
                <span style={s.premBadge}>
                  <i className="ti ti-star" style={{ fontSize: 11 }} aria-hidden="true" />
                  Premium member
                </span>
              </div>

              <div style={s.divider} />

              {/* Stats */}
              <div style={s.statsBlock}>
                {[
  {
    label: "Member since",
    value: user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString()
      : "N/A",
  },
  {
    label: "Total reports",
    value: reports.length,
  },
  {
    label: "Avg score",
    value: `${avgScore}%`,
  },
  {
    label: "Best score",
    value: `${bestScore}%`,
  },
].map(({ label, value, color }) => (
                  <div key={label} style={s.statRow}>
                    <span style={s.statLabel}>{label}</span>
                    <span style={{ ...s.statValue, color }}>{value}</span>
                  </div>
                ))}
              </div>

              <div style={s.divider} />

              {/* Actions */}
              <div style={s.actionBlock}>
                <button
                  onClick={() => navigate("/")}
                  style={s.actionBtn}
                  onMouseEnter={e => e.currentTarget.style.background = "#2D3748"}
                  onMouseLeave={e => e.currentTarget.style.background = "#1E293B"}
                >
                  <i className="ti ti-sparkles" style={{ fontSize: 15, color: "#A78BFA" }} aria-hidden="true" />
                  Generate report
                </button>
                <button
                  onClick={() => navigate("/reports")}
                  style={s.actionBtn}
                  onMouseEnter={e => e.currentTarget.style.background = "#2D3748"}
                  onMouseLeave={e => e.currentTarget.style.background = "#1E293B"}
                >
                  <i className="ti ti-file-description" style={{ fontSize: 15, color: "#A78BFA" }} aria-hidden="true" />
                  My reports
                </button>
                <button
                  onClick={onLogout}
                  style={s.logoutActionBtn}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <i className="ti ti-logout" style={{ fontSize: 15, color: "#F87171" }} aria-hidden="true" />
                  Logout
                </button>
              </div>
            </div>

            {/* ── RIGHT: three cards ── */}
            <div style={s.rightCol}>

              {/* Readiness ring */}
              <div style={s.rightCard}>
                <div style={s.ringRow}>
                  <ReadinessRing value={avgScore} />
                  <div style={s.ringMeta}>
                    <p style={s.ringTitle}>Interview readiness</p>
                    <p style={s.ringSub}>Based on your last {reports.length} reports</p>
                    <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                       <span style={s.tagGreen}>
                        {avgScore >= 80
                         ? "Excellent"
                          : avgScore >= 60
                         ? "Good"
                          : avgScore > 0
                         ? "Needs Improvement"
                          : "No Reports"}
                       </span>
                     <span style={s.tagPurple}>
                          Avg Score: {avgScore}%
                      </span>
                   </div>
                  </div>
                </div>
              </div>

              {/* Skill breakdown */}
              <div style={s.rightCard}>
                   <p style={s.cardLabel}>Skill Gaps</p>

                 {skillGaps.length === 0 ? (
                 <p style={{ color: "#94A3B8" }}>
                    No skill gaps found.
                    </p>
            ) : (
               skillGaps.map((skill, index) => (
            <div
                 key={index}
                  style={{
                  display: "flex",
                  justifyContent: "space-between",
                   padding: "10px 0",
                   borderBottom: "1px solid #334155",
                }}
             >

                    <div>
  <div
    style={{
      color: "#F8FAFC",
      fontWeight: "600",
    }}
  >
    {skill.skill}
  </div>

  <div
    style={{
      color: "#94A3B8",
      fontSize: "12px",
      marginTop: "4px",
      maxWidth: "350px",
      lineHeight: "18px",
    }}
  >
    {getSkillRecommendation(skill.skill)}
  </div>
</div>

               <span
                  style={{
                   color:
                   skill.severity === "high"
                ? "#EF4444"
                : skill.severity === "medium"
                ? "#F59E0B"
                : "#10B981",
            fontWeight: "600",
          }}
        >
          {skill.severity.toUpperCase()}
        </span>
      </div>
    ))
  )}
</div>

              {/* Recent reports */}
              <div style={s.rightCard}>
                <div style={s.cardHead}>
                  <p style={s.cardLabel}>Recent reports</p>
                  <button onClick={() => navigate("/reports")} style={s.viewAllBtn}>
                    View all <i className="ti ti-chevron-right" style={{ fontSize: 13 }} aria-hidden="true" />
                  </button>
                </div>
                 {reports.slice(0, 5).map((r, i) => {
                  const sc = scoreStyle(r.matchScore || 0);

              return (
                      <div
                           key={r._id}
                           style={{
                           ...s.reportRow,
                           borderBottom:
                            i < reports.length - 1
                            ? "0.5px solid #1E293B"
                          : "none",
                        }}
                        >
      <div style={s.reportIco}>
        <i className="ti ti-file-description" />
      </div>

      <div style={s.reportInfo}>
        <p style={s.reportTitle}>{r.title}</p>
        <p style={s.reportMeta}>
          {new Date(r.createdAt).toLocaleDateString()}
        </p>
      </div>

      <span
        style={{
          ...s.scorePill,
          background: sc.bg,
          color: sc.color,
        }}
      >
        {r.matchScore || 0}%
      </span>
    </div>
  );
})}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Styles ── */
const s = {
  shell: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    background: "#0F172A",
  },

  /* Sidebar */
  sidebar: {
    width: 220,
    minWidth: 220,
    background: "#0F172A",
    borderRight: "1px solid #1E293B",
    display: "flex",
    flexDirection: "column",
    padding: "22px 0",
    position: "sticky",
    top: 0,
    height: "100vh",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 18px 20px",
    borderBottom: "1px solid #1E293B",
  },
  brandIco: {
    width: 34, height: 34, borderRadius: 8,
    background: "#7C3AED", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: 12, flexShrink: 0,
  },
  brandTitle: { color: "#F8FAFC", fontWeight: 600, fontSize: 13, lineHeight: 1.3 },
  brandSub: { color: "#475569", fontSize: 10 },
  nav: {
    display: "flex", flexDirection: "column",
    padding: "14px 10px", gap: 2, flex: 1,
  },
  navBtn: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "9px 12px", borderRadius: 8,
    border: "none", background: "transparent",
    color: "#64748B", fontSize: 13, fontWeight: 500,
    cursor: "pointer", textAlign: "left", width: "100%",
    fontFamily: "inherit", transition: "all 0.15s",
  },
  navActive: { background: "#7C3AED", color: "#fff" },
  sideLogout: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "10px 22px", background: "transparent",
    border: "none", color: "#EF4444", fontSize: 13,
    fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
  },

  /* Topbar */
  topbar: {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 24px",
  height: "79px",       // fixed height
  background: "#0F172A",
  borderBottom: "1px solid #1E293B",
  position: "sticky",
  top: 0,
  zIndex: 10,
},
  topRight: { display: "flex", alignItems: "center", gap: 14 },
  bellBtn: {
    background: "none", border: "none",
    cursor: "pointer", padding: 4,
    display: "flex", alignItems: "center",
  },
  userChip: { display: "flex", alignItems: "center", gap: 8 },
  chipAv: {
    width: 34, height: 34, borderRadius: "50%",
    background: "#7C3AED", color: "#fff",
    display: "flex", alignItems: "center",
    justifyContent: "center", fontWeight: 600, fontSize: 13,
  },
  chipName: { fontSize: 13, fontWeight: 600, color: "#F8FAFC" },
  chipBadge: {
    fontSize: 10, color: "#A78BFA", fontWeight: 600,
    background: "#312E81", borderRadius: 4, padding: "1px 6px",
  },

  /* Page body */
  pageBody: {
    flex: 1,
    background: "#0F172A",
    padding: "28px 28px 40px",
    minHeight: "calc(100vh - 57px)",
  },
  // pageTitleRow: {
  //   marginBottom: 11,
  // },
  pageTitleRow: {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center", 
  },
  pageTitle: {
    fontSize: 20, fontWeight: 700,
    color: "#F8FAFC", margin: "0 0 4px",
  },
  pageSub: {
    fontSize: 13, color: "#64748B", margin: 0,
  },

  /* Main layout */
  main: { flex: 1, display: "flex", flexDirection: "column" },
  grid: {
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    gap: 20,
    alignItems: "start",
  },

  /* Dark identity card */
  darkCard: {
    background: "#1E293B",
    borderRadius: 16,
    border: "1px solid #334155",
    padding: "24px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  avatarSection: {
    display: "flex", flexDirection: "column",
    alignItems: "center", gap: 6,
  },
  avatarWrap: { position: "relative", marginBottom: 4 },
  avatarCircle: {
    width: 72, height: 72, borderRadius: "50%",
    background: "#7C3AED", color: "#fff",
    display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: 26, fontWeight: 700,
  },
  onlineDot: {
    position: "absolute", bottom: 3, right: 3,
    width: 15, height: 15, borderRadius: "50%",
    background: "#10B981", border: "2.5px solid #1E293B",
  },
  idName: {
    fontSize: 16, fontWeight: 700,
    color: "#F8FAFC", margin: "4px 0 0", textAlign: "center",
  },
  idEmail: {
    fontSize: 12, color: "#64748B",
    margin: "2px 0 6px", textAlign: "center",
  },
  premBadge: {
    display: "inline-flex", alignItems: "center", gap: 5,
    fontSize: 11, fontWeight: 600,
    background: "#312E81", color: "#A5B4FC",
    padding: "4px 12px", borderRadius: 20,
  },
  divider: { height: "1px", background: "#334155" },
  statsBlock: { display: "flex", flexDirection: "column", gap: 10 },
  statRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  statLabel: { fontSize: 12, color: "#64748B" },
  statValue: { fontSize: 13, fontWeight: 700 },
  actionBlock: { display: "flex", flexDirection: "column", gap: 6 },
  actionBtn: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 12px", borderRadius: 9,
    border: "none", background: "#0F172A",
    color: "#94A3B8", fontSize: 13, fontWeight: 500,
    cursor: "pointer", width: "100%", fontFamily: "inherit",
    transition: "background 0.15s",
  },
  logoutActionBtn: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 12px", borderRadius: 9,
    border: "none", background: "transparent",
    color: "#F87171", fontSize: 13, fontWeight: 500,
    cursor: "pointer", width: "100%", fontFamily: "inherit",
    transition: "background 0.15s", marginTop: 2,
  },

  /* Right column */
  rightCol: { display: "flex", flexDirection: "column", gap: 16 },
  rightCard: {
    background: "#1E293B",
    border: "1px solid #334155",
    borderRadius: 14,
    padding: "20px 22px",
  },
  cardLabel: {
    fontSize: 13, fontWeight: 700,
    letterSpacing: "0.1em", textTransform: "uppercase",
    color: "#59677a", margin: "0 0 16px",
  },
  cardHead: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between", marginBottom: 16,
  },
  viewAllBtn: {
    display: "flex", alignItems: "center", gap: 2,
    background: "none", border: "none",
    color: "#7C3AED", fontSize: 13, fontWeight: 600,
    cursor: "pointer", padding: 0, fontFamily: "inherit",
  },

  /* Ring card */
  ringRow: { display: "flex", alignItems: "center", gap: 20 },
  ringMeta: {},
  ringTitle: { fontSize: 15, fontWeight: 700, color: "#F8FAFC", margin: "0 0 4px" },
  ringSub: { fontSize: 12, color: "#64748B", margin: 0 },
  tagGreen: {
    fontSize: 11, fontWeight: 600,
    background: "#064E3B", color: "#6EE7B7",
    padding: "3px 10px", borderRadius: 20,
  },
  tagPurple: {
    fontSize: 11, fontWeight: 600,
    background: "#312E81", color: "#A5B4FC",
    padding: "3px 10px", borderRadius: 20,
  },

  /* Skills */
  skillHead: {
    display: "flex", justifyContent: "space-between",
    marginBottom: 6,
  },
  skillLabel: { fontSize: 13, color: "#94A3B8" },
  skillPct: { fontSize: 13, fontWeight: 700 },
  barTrack: {
    height: 6, background: "#0F172A",
    borderRadius: 3, overflow: "hidden",
  },
  barFill: {
    height: "100%", borderRadius: 3,
    transition: "width 1s ease",
  },

  /* Reports */
  reportRow: {
    display: "flex", alignItems: "center",
    gap: 12, padding: "12px 0",
  },
  reportIco: {
    width: 36, height: 36, borderRadius: 9,
    background: "#312E81",
    display: "flex", alignItems: "center",
    justifyContent: "center", flexShrink: 0,
  },
  reportInfo: { flex: 1, minWidth: 0 },
  reportTitle: {
    fontSize: 13, fontWeight: 600,
    color: "#F8FAFC", margin: 0,
    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
  },
  reportMeta: { fontSize: 11, color: "#64748B", margin: "2px 0 0" },
  scorePill: {
    fontSize: 11, fontWeight: 700,
    padding: "3px 10px", borderRadius: 20, flexShrink: 0,
  },
  dlBtn: {
    background: "none", border: "none",
    cursor: "pointer", padding: 4, borderRadius: 6,
    display: "flex", alignItems: "center",
  },
};
