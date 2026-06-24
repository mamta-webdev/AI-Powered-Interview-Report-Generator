// import { useNavigate } from "react-router"

// export default function Dashboard(){

// const navigate = useNavigate()

// return(

//     <div>
    
//     <h1>
//     Welcome Back 👋
//     </h1>
    
//     <button
//     onClick={()=>{
//     navigate("/")
//     }}
//     >
//     Generate Interview Report
//     </button>
    
    
//     <button
//     onClick={()=>{
//     navigate("/reports")
//     }}
//     >
//     My Reports
//     </button>
    
    
//     <button onClick={()=>{
//      localStorage.removeItem("token")
//      navigate("/login")
// }}>
//     Logout
//     </button>
    
    
//     </div>
    
//     )}    

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getAllInterviewReports } from "./services/interview.api"; 
import { useAuth } from "../../auth/hooks/use.Auth"
import { useInterview } from "../../interview/hooks/useInterview"

const sidebarLinks = [
  { icon: "⊞", label: "Dashboard", path: "/dashboard" },
  { icon: "⊕", label: "Generate Report", path: "/" },
  { icon: "☰", label: "My Reports", path: "/reports", active: true },
  { icon: "◯", label: "Profile", path: "/profile" },
  { icon: "⚙", label: "Settings", path: "/settings" },
];


export default function Dashboard() {
  const navigate = useNavigate();
  const { getResumePdf } = useInterview();
  const { user, handleLogOut } = useAuth();
  const [reports, setReports] = useState([]);

const averageScore =
  reports.length > 0
    ? Math.round(
        reports.reduce(
          (sum, report) => sum + (report.matchScore || 0),
          0
        ) / reports.length
      )
    : 0;

const stats = [
  {
    label: "Total Reports",
    value: reports.length,
    sub: "Generated reports",
    icon: "📄",
    trend: null,
  },
  {
    label: "Average Score",
    value: `${averageScore}%`,
    sub: "Interview readiness",
    icon: "📈",
    trend: "up",

  },
  {
    label: "PDF Downloads",
    value: reports.length,
    sub: "Available reports",
    icon: "⬇",
    trend: null,
  },
  {
    label: "Last Generated",
    value:
      reports.length > 0
        ? new Date(reports[0].createdAt).toLocaleDateString()
        : "N/A",
    sub: reports.length ? "Latest report" : "No reports",
    icon: "📅",
    trend: null,
  },
];
  useEffect(() => {
  const fetchReports = async () => {
    try {
      const data = await getAllInterviewReports();

      console.log(data);

      setReports(data.interviewReports || []);
    } catch (error) {
      console.log(error);
    }
  };

  fetchReports();
}, []);


  return (
    <div style={styles.shell}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarBrand}>
          <div style={styles.brandIcon}>AI</div>
          <div>
            <div style={styles.brandTitle}>AI Interview</div>
            <div style={styles.brandSub}>Report Generator</div>
          </div>
        </div>

        <nav style={styles.nav}>
           {sidebarLinks.map((link) => (
             <button
               key={link.label}
                onClick={() => navigate(link.path)}
                style={styles.navItem}
            >
      <span style={styles.navIcon}>{link.icon}</span>
      {link.label}
    </button>
  ))}
</nav>

        <button style={styles.logoutBtn} onClick={async () => {
               await handleLogOut();
               navigate("/login");
         }}> 
          <span style={{ color: "#EF4444" }}>⬡</span> Logout
        </button>
      </aside>

      {/* Main */}
      <div style={styles.main}>
        {/* Top Navbar */}
        <header style={styles.topbar}>
            <div style={styles.topbarTitle}>
                  {/* <h1 style={styles.topHeading}>Dashboard</h1> */}
                  <h1 style={styles.topHeading}>
                        📊 Dashboard
                   </h1>
                  <p style={styles.topbarSub}>
                     Track reports, scores, and interview progress
                  </p>
          </div>
          <div style={styles.topbarRight}>
            <button style={styles.iconBtn}>🔔</button>
            <div style={styles.userChip}>
              <div style={styles.avatarCircle}>
                  {user?.username?.charAt(0)?.toUpperCase() || "U"}
             </div>
              <span style={{ color: "#9CA3AF", fontSize: 12 }}>▾</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={styles.content}>
          {/* Welcome Banner */}
          <section style={styles.welcomeBanner}>
            <div>
              <h1 style={styles.welcomeTitle}>Welcome back, {user?.username || "User"}! 👋</h1>
              <p style={styles.welcomeSub}>Let's crack your next interview.</p>
              <button style={styles.primaryBtn} onClick={() => navigate("/")}>＋ Generate New Report</button>
            </div>
            <div style={styles.welcomeIllustration}>
              <div style={styles.illustrationCircle}>
                <span style={{ fontSize: 36 }}>🤖</span>
              </div>
              <div style={styles.illustrationDot1} />
              <div style={styles.illustrationDot2} />
            </div>
          </section>

          {/* Stats */}
          <section style={styles.statsGrid}>
            {stats.map((s) => (
              <div key={s.label} style={styles.statCard}>
                <div style={styles.statTop}>
                  <span style={styles.statLabel}>{s.label}</span>
                  <span style={styles.statIconBox}>{s.icon}</span>
                </div>
                <div style={styles.statValue}>{s.value}</div>
                <div style={styles.statSub}>{s.sub}</div>
                {s.trend === "up" && (
                  <div style={styles.trendBar}>
                   <div
                        style={{
                          ...styles.trendFill,
                          width: `${averageScore}%`,
                        }}
                    />
              </div>
              )}
              </div>
            ))}
          </section>

          {/* Recent Reports */}
          {/* <section style={styles.recentSection}>
            <div style={styles.recentHeader}>
              <h2 style={styles.sectionTitle}>Recent Reports</h2>
              <button style={styles.viewAllBtn} onClick={() => navigate("/reports")}>View all →</button>
            </div>

            <div style={styles.reportsList}>
              {recentReports.map((r) => (
                <div key={r.id} style={styles.reportRow}>
                  <div style={styles.reportIconBox}>
                    <span style={{ fontSize: 18 }}>📋</span>
                  </div>
                  <div style={styles.reportInfo}>
                    <div style={styles.reportTitle}>{r.title}</div>
                    <div style={styles.reportDate}>{r.date}</div>
                  </div>
                  <div
                    style={{
                      ...styles.reportScore,
                      color: r.scoreColor,
                    }}
                  >
                    {r.score}%
                  </div>
                  <div style={styles.reportActions}>
                    <button style={styles.actionBtn}>View Report</button>
                    <button style={styles.actionBtnOutline}>
                      ⬇ Download PDF
                    </button>
                    <button style={styles.moreBtn}>⋯</button>
                  </div>
                </div>
              ))}
            </div>
          </section> */}

          <section style={styles.recentSection}>
  <div style={styles.recentHeader}>
    <h2 style={styles.sectionTitle}>Recent Reports</h2>

    <button
      style={styles.viewAllBtn}
      onClick={() => navigate("/reports")}
    >
      View all →
    </button>
  </div>

  <div style={styles.reportsList}>
    {reports.length === 0 ? (
      <div
        style={{
          textAlign: "center",
          padding: "40px 20px",
          color: "#9CA3AF",
        }}
      >
        <h3>No Reports Yet</h3>
        <p>Generate your first interview report to see it here.</p>

        <button
          style={styles.primaryBtn}
          onClick={() => navigate("/")}
        >
          Generate Report
        </button>
      </div>
    ) : (
      reports.map((r) => (
        <div key={r._id} style={styles.reportRow}>
          <div style={styles.reportIconBox}>
            <span style={{ fontSize: 18 }}>📋</span>
          </div>

          <div style={styles.reportInfo}>
            <div style={styles.reportTitle}>
              {r.title || "Interview Report"}
            </div>

            <div style={styles.reportDate}>
              {new Date(r.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div
            style={{
              ...styles.reportScore,
              color:
                r.matchScore >= 80
                  ? "#10B981"
                  : r.matchScore >= 60
                  ? "#F59E0B"
                  : "#EF4444",
            }}
          >
            {r.matchScore || 0}%
          </div>

          <div style={styles.reportActions}>
            <button
              style={styles.actionBtn}
              onClick={() =>
                navigate(`/interview/${r._id}`)
              }
            >
              View Report
            </button>

            <button style={styles.actionBtnOutline}
            onClick={() =>
                          getResumePdf({
                          interviewReportId: r._id,
                         })
                      }>
              ⬇ Download PDF
            </button>

            <button style={styles.moreBtn}>⋯</button>
          </div>
        </div>
      ))
    )}
  </div>
</section>
        </main>
      </div>
    </div>
  );
}

const styles = {
  shell: {
    display: "flex",
    minHeight: "100vh",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    background: "#F8FAFC",
    color: "#111827",
  },

  // Sidebar
  sidebar: {
    width: 220,
    minWidth: 220,
    background: "#111827",
    display: "flex",
    flexDirection: "column",
    padding: "24px 0",
    position: "sticky",
    top: 0,
    height: "100vh",
  },
  sidebarBrand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 20px 28px",
    borderBottom: "1px solid #1F2937",
  },
  brandIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    background: "#7C3AED",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 13,
  },
  brandTitle: {
    color: "#F9FAFB",
    fontWeight: 600,
    fontSize: 14,
    lineHeight: 1.3,
  },
  brandSub: {
    color: "#6B7280",
    fontSize: 11,
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    padding: "16px 12px",
    gap: 4,
    flex: 1,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 8,
    border: "none",
    background: "transparent",
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.15s",
  },
  navItemActive: {
    background: "#7C3AED",
    color: "#fff",
  },
  navIcon: {
    fontSize: 15,
    width: 18,
    textAlign: "center",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 24px",
    background: "transparent",
    border: "none",
    color: "#EF4444",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    marginTop: "auto",
  },

  // Topbar
  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 28px",
    background: "#0F172A",
    borderBottom: "1px solid ",
    position: "sticky",
    top: 0,
    height: "72px",
    zIndex: 10,
  },
//   topbarTitle: {
//   fontSize: "16px",
//   fontWeight: "900",
//   WebkitBackgroundClip: "text",
//   WebkitTextFillColor: "transparent",
//   letterSpacing: "-1px",
//   cursor: "pointer",
//   transition: "all 0.3s ease",
// },
  topHeading:{
  fontSize: "24px",
  fontWeight: "900",
  letterSpacing: "-1px",
  cursor: "pointer",
  color: "#cf4379",
  },
  topbarSub: {
  margin: "2px 0 0",
  fontSize: "12px",
  color: "#2a4ab154",
  fontWeight: 500,
  },
  topbarRight: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  iconBtn: {
    background: "none",
    border: "none",
    fontSize: 15,
    cursor: "pointer",
    padding: 4,
  },
  userChip: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    cursor: "pointer",
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "#7C3AED",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    fontSize: 14,
  },
  

  // Main content
  main: { flex: 1, display: "flex", flexDirection: "column" },
  content: { padding: "28px", display: "flex", flexDirection: "column", gap: 24 },

  // Welcome
  welcomeBanner: {
    background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
    borderRadius: 16,
    padding: "28px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#fff",
    overflow: "hidden",
    position: "relative",
  },
  welcomeTitle: { margin: "0 0 6px", fontSize: 22, fontWeight: 700 },
  welcomeSub: { margin: "0 0 20px", fontSize: 14, opacity: 0.85 },
  primaryBtn: {
    background: "#fff",
    color: "#7C3AED",
    border: "none",
    borderRadius: 8,
    padding: "10px 20px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  welcomeIllustration: {
    position: "relative",
    width: 80,
    height: 80,
  },
  illustrationCircle: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  illustrationDot1: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: "50%",
    background: "#FCD34D",
  },
  illustrationDot2: {
    position: "absolute",
    bottom: 4,
    left: 0,
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "#34D399",
  },

  // Stats
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 16,
  },
  statCard: {
    background: "#fff",
    borderRadius: 12,
    padding: "20px",
    border: "1px solid #E5E7EB",
  },
  statTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  statLabel: { fontSize: 12, color: "#6B7280", fontWeight: 500 },
  statIconBox: {
    width: 32,
    height: 32,
    background: "#F3F4F6",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
  },
  statValue: { fontSize: 26, fontWeight: 700, color: "#111827", lineHeight: 1 },
  statSub: { fontSize: 11, color: "#9CA3AF", marginTop: 4 },
  trendBar: {
    marginTop: 10,
    height: 4,
    background: "#EDE9FE",
    borderRadius: 2,
    overflow: "hidden",
  },
  trendFill: {
  height: "100%",
  background: "#7C3AED",
  borderRadius: 2,
},

  // Recent reports
  recentSection: {
    background: "#fff",
    borderRadius: 14,
    padding: "22px 24px",
    border: "1px solid #E5E7EB",
  },
  recentHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  sectionTitle: { fontSize: 15, fontWeight: 600, margin: 0, color: "#111827" },
  viewAllBtn: {
    background: "none",
    border: "none",
    color: "#7C3AED",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
  },
  reportsList: { display: "flex", flexDirection: "column", gap: 0 },
  reportRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "14px 0",
    borderBottom: "1px solid #F3F4F6",
  },
  reportIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: "#EDE9FE",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  reportInfo: { flex: 1 },
  reportTitle: { fontSize: 13, fontWeight: 600, color: "#111827" },
  reportDate: { fontSize: 11, color: "#9CA3AF", marginTop: 2 },
  reportScore: { fontWeight: 700, fontSize: 15, minWidth: 44, textAlign: "right" },
  reportActions: { display: "flex", gap: 8, alignItems: "center" },
  actionBtn: {
    padding: "6px 14px",
    border: "1px solid #E5E7EB",
    borderRadius: 7,
    background: "#fff",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    color: "#374151",
  },
  actionBtnOutline: {
    padding: "6px 14px",
    border: "1px solid #E5E7EB",
    borderRadius: 7,
    background: "#fff",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    color: "#374151",
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
  moreBtn: {
    background: "none",
    border: "none",
    fontSize: 16,
    cursor: "pointer",
    color: "#9CA3AF",
    padding: "4px 6px",
  },
};
