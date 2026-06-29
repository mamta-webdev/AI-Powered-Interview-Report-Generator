import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { getAllInterviewReports } from "./services/interview.api";
import { useEffect } from "react";
import { useInterview } from "../../interview/hooks/useInterview"


const PAGE_SIZE = 4;

const scoreConfig = (score) => {
  if (score >= 80) return { color: "#059669", bg: "#D1FAE5", label: "Strong" };
  if (score >= 65) return { color: "#D97706", bg: "#FEF3C7", label: "Good" };
  return { color: "#DC2626", bg: "#FEE2E2", label: "Needs work" };
};

const sidebarLinks = [
  { icon: "⊞", label: "Dashboard", path: "/dashboard" },
  { icon: "⊕", label: "Generate Report", path: "/" },
  { icon: "☰", label: "My Reports", path: "/reports", active: true },
  { icon: "◯", label: "Profile", path: "/profile" },
  { icon: "⚙", label: "Settings", path: "/settings" },
];

export default function Reports() {
  const navigate = useNavigate();
  const { getResumePdf } = useInterview();
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Jobs");
  const [sortOrder, setSortOrder] = useState("Latest First");
  const [page, setPage] = useState(1);

  useEffect(() => {
  const fetchReports = async () => {
    try {
      const data = await getAllInterviewReports();

      console.log("REPORTS =", data);

      setReports(data.interviewReports || []);
    } catch (error) {
      console.log(error);
    }
  };

  fetchReports();
}, []);

  const roles = ["All Jobs", ...Array.from(new Set(reports.map((report) => ( report.role))))];

  const filtered = useMemo(() => {
    let data = [...reports];
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((r) => r.title.toLowerCase().includes(q));
    }
    if (roleFilter !== "All Jobs") {
      data = data.filter((r) => r.role === roleFilter);
    }
    if (sortOrder === "Latest First") {
      data.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
     );
    } else if (sortOrder === "Highest Score") {
      data.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    } else if (sortOrder === "Lowest Score") {
      data.sort((a, b) => (a.matchScore || 0) - (b.matchScore || 0));
    }
    return data;
  }, [search, roleFilter, sortOrder]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };
  const handleRole = (e) => { setRoleFilter(e.target.value); setPage(1); };
  const handleSort = (e) => { setSortOrder(e.target.value); setPage(1); };

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
                 style={{
                     ...styles.navItem,
                    ...(link.active ? styles.navItemActive : {}),
                  }}
             >
              <span style={styles.navIcon}>{link.icon}</span>
              {link.label}
            </button>
          ))}
        </nav>
        <button style={styles.logoutBtn}>
          <span style={{ color: "#EF4444" }}>⬡</span> Logout
        </button>
      </aside>

      {/* Main */}
      <div style={styles.main}>
        {/* Topbar */}
        <header style={styles.topbar}>

          <div style={styles.topbarRight}>
            <button style={styles.iconBtn}>🔔</button>
            <div style={styles.userChip}>
              <div style={styles.avatarCircle}>M</div>
              <div>
                <div style={styles.userName}>Mahi</div>
              </div>
              <span style={{ color: "#9CA3AF", fontSize: 12 }}>▾</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={styles.content}>
          <div style={styles.pageHeader}>
            <div>
              <h1 style={styles.pageTitle}>My Reports</h1>
              <p style={styles.pageSub}>All your generated interview reports</p>
            </div>
    
            <button
             style={styles.primaryBtn}
             onClick={() => navigate("/")}
                 onMouseEnter={(e) => {
                e.target.style.background = "#10B981";
                e.target.style.borderColor = "#10B981";
                e.target.style.color = "#FFFFFF";
              }}
                onMouseLeave={(e) => {
               e.target.style.background = "transparent";
               e.target.style.borderColor = "#334155";
               e.target.style.color = "#F8FAFC";
            }}>
             ＋ Generate New Report
           </button>
          </div>

          {/* Filters */}
          <div style={styles.filterRow}>
            <div style={styles.searchWrap}>
              <span style={styles.searchIconInner}>🔍</span>
              <input
                placeholder="Search reports..."
                value={search}
                onChange={handleSearch}
                style={styles.filterSearch}
              />
            </div>
            <div style={styles.filterGroup}>
              <select value={roleFilter} onChange={handleRole} style={styles.select}>
                {roles.map((r) => <option key={r}>{r}</option>)}
              </select>
              <select value={sortOrder} onChange={handleSort} style={styles.select}>
                <option>Latest First</option>
                <option>Highest Score</option>
                <option>Lowest Score</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div style={styles.tableCard}>
            {paginated.length === 0 ? (
              <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>📊</div>

              <h3 style={styles.emptyTitle}>
                   No Reports Found
               </h3>

              <p style={styles.emptyText}>
                 Generate your first interview report and track your
                  interview readiness score.
               </p>

            </div>
            ) : (
              <>
                {paginated.map((r, idx) => {
                  const sc = scoreConfig(r.matchScore || 0);
                  return (
                    <div
                      key={r._id}
                      style={{
                        ...styles.tableRow,
                        borderBottom:
                          idx < paginated.length - 1
                            ? "1px solid #F3F4F6"
                            : "none",
                      }}
                    >
                      {/* Icon + name */}
                      <div style={styles.colName}>
                        <div style={styles.rowIcon}>
                          <span style={{ fontSize: 16 }}>📋</span>
                        </div>
                        <div>
                          <div style={styles.rowTitle}>{r.title}</div>
                          <div style={styles.rowMeta}>
                            Generated on {new Date(r.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {/* Score */}
                      <div style={styles.colScore}>
                        <span
                          style={{
                            ...styles.scoreBadge,
                            color: sc.color,
                            background: sc.bg,
                          }}
                        >
                          {r.matchScore || 0}%
                        </span>
                      </div>

                      {/* Status */}
                      <div style={styles.colStatus}>
                        <span style={styles.statusDot} />
                        <span style={styles.statusText}>Completed</span>
                      </div>

                      {/* Actions */}
                      <div style={styles.colActions}>
                        <button style={styles.actionIconBtn} title="View report" 
                        onClick={() => navigate(`/interview/${r._id}`)}>
                          👁
                        </button>
                        <button
                             style={styles.actionIconBtn}
                             title="Download PDF"
                             onClick={() =>
                               getResumePdf({
                               interviewReportId: r._id,
                             })
                             }>
                                  ⬇
                        </button>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                style={styles.pageBtn}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  style={{
                    ...styles.pageBtn,
                    ...(page === n ? styles.pageBtnActive : {}),
                  }}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
              <button
                style={styles.pageBtn}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                ›
              </button>
            </div>
          )}
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
  brandTitle: { color: "#F9FAFB", fontWeight: 600, fontSize: 14, lineHeight: 1.3 },
  brandSub: { color: "#6B7280", fontSize: 11 },
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
  },
  navItemActive: { background: "#7C3AED", color: "#fff" },
  navIcon: { fontSize: 15, width: 18, textAlign: "center" },
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
  },
  main: { flex: 1, display: "flex", flexDirection: "column" },
  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 28px",
    background: "#fff",
    borderBottom: "1px solid #E5E7EB",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#F3F4F6",
    borderRadius: 8,
    padding: "8px 14px",
    width: 280,
    // maxWidth: "320px",
  },
  searchInput: {
    border: "none",
    background: "transparent",
    outline: "none",
    fontSize: 13,
    color: "#374151",
    width: "100%",
  },
  topbarRight: { display: "flex", alignItems: "center", gap: 6 },
  iconBtn: { background: "none", border: "none", fontSize: 14, cursor: "pointer", padding: 4 },
  userChip: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer" },
  avatarCircle: {
    width: 34, height: 34, borderRadius: "50%",
    background: "#7C3AED", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 600, fontSize: 14,
  },
  userName: { fontSize: 13, fontWeight: 600, color: "#111827" },
  content: { padding: "28px", display: "flex", flexDirection: "column", gap: 20 },
 
pageHeader: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
  width: "100%",
},
  primaryBtn: {
    background: "transparent",
    color: "#F8FAFC",
    border: "1px solid #334155",
    borderRadius: 8,
    padding: "10px 20px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
pageTitle: {
  fontSize: "36px",
  fontWeight: 800,
  color: "#fff",
},

pageSub: {
  fontSize: "14px",
  color: "#94A3B8",
},
filterRow: {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  marginBottom: "24px",
},
  searchWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    padding: "8px 14px",
    flex: 1,
    maxWidth: 340,
  },
  searchIconInner: { fontSize: 14, color: "#9CA3AF" },
  filterSearch: {
    border: "none",
    outline: "none",
    fontSize: 13,
    color: "#374151",
    background: "transparent",
    width: "100%",
  },
  filterGroup: { display: "flex", gap: 10 },
  select: {
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 13,
    color: "#374151",
    background: "#fff",
    cursor: "pointer",
    outline: "none",
  },
  tableCard: {
  background: "#1E293B",
  borderRadius: "16px",
  overflow: "hidden",
  border: "1px solid #334155",
  minHeight: "350px",
},
  tableRow: {
    display: "flex",
    alignItems: "center",
    padding: "14px 20px",
    gap: 16,
    transition: "background 0.1s",
  },
  colName: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: "#EDE9FE",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rowTitle: { fontSize: 13, fontWeight: 600, color: "#f3f3f3" },
  rowMeta: { fontSize: 11, color: "#9CA3AF", marginTop: 2 },
  colScore: { minWidth: 70, display: "flex", justifyContent: "center" },
  scoreBadge: {
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
  },
  colStatus: {
    minWidth: 100,
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#10B981",
    flexShrink: 0,
  },
  statusText: { fontSize: 12, color: "#059669", fontWeight: 500 },
  colActions: {
    display: "flex",
    gap: 6,
    alignItems: "center",
  },
  actionIconBtn: {
    background: "none",
    border: "1px solid #E5E7EB",
    borderRadius: 7,
    width: 34,
    height: 34,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    cursor: "pointer",
    color: "#6B7280",
  },
  emptyState: {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "60px 20px",
},

emptyIcon: {
  fontSize: "50px",
  marginBottom: "16px",
},

emptyTitle: {
  color: "#F8FAFC",
  fontSize: "22px",
  fontWeight: "600",
  margin: "0 0 10px",
},

emptyText: {
  color: "#94A3B8",
  fontSize: "14px",
  textAlign: "center",
  maxWidth: "350px",
  lineHeight: "1.6",
  marginBottom: "20px",
},
  pagination: {
    display: "flex",
    justifyContent: "center",
    gap: 6,
    marginTop: 4,
  },
  pageBtn: {
    width: 34,
    height: 34,
    borderRadius: 7,
    border: "1px solid #E5E7EB",
    background: "#fff",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    color: "#374151",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  pageBtnActive: {
    background: "#7C3AED",
    color: "#fff",
    borderColor: "#7C3AED",
  },
};
