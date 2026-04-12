import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";
import { getDashboardNav } from "../utils/navConfig";

const API = process.env.REACT_APP_API_URL;

function MyResults() {
  const navigate = useNavigate();
  const { user, studentProfile, logout } = useUser();
  const { isDarkMode, theme } = useTheme();
  const [profileCheckLoading, setProfileCheckLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== "admin" && !studentProfile) {
      navigate("/student-profile", {
        state: { message: "Please complete your profile to access readiness assessments." }
      });
    } else {
      setProfileCheckLoading(false);
    }
  }, [user, studentProfile, navigate]);

  const [attempts, setAttempts] = useState({ exam: [], placement: [] });
  const [loading, setLoading] = useState(true);
  const [expandedExamRow, setExpandedExamRow] = useState(null);
  const [expandedPlacementRow, setExpandedPlacementRow] = useState(null);

  const toggleExamRow = (idx) => {
    setExpandedExamRow(expandedExamRow === idx ? null : idx);
  };

  const togglePlacementRow = (idx) => {
    setExpandedPlacementRow(expandedPlacementRow === idx ? null : idx);
  };

  const calculateAverages = (subjects) => {
    if (!subjects || subjects.length === 0) return { internal: "-", assignment: "-", attendance: "-", studyHours: "-" };
    const total = subjects.length;
    const internal = Math.round(subjects.reduce((sum, s) => sum + Number(s.internalMarks || 0), 0) / total);
    const assignment = Math.round(subjects.reduce((sum, s) => sum + Number(s.assignmentCompletion || 0), 0) / total);
    const attendance = Math.round(subjects.reduce((sum, s) => sum + Number(s.attendance || 0), 0) / total);
    const studyHoursValue = subjects.reduce((sum, s) => sum + Number(s.studyHours || 0), 0) / total;
    const studyHours = studyHoursValue % 1 === 0 ? studyHoursValue : studyHoursValue.toFixed(1);
    return { internal, assignment, attendance, studyHours };
  };

  useEffect(() => {
    if (user?.userEmail) {
      fetchAllAttempts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchAllAttempts = async () => {
    try {
      const [examRes, placementRes] = await Promise.all([
        axios.get(`${API}/my-exam-attempts/${user?.userEmail}`),
        axios.get(`${API}/my-placement-attempts/${user?.userEmail}`)
      ]);

      setAttempts({
        exam: Array.isArray(examRes.data) ? examRes.data : examRes.data?.attempts || [],
        placement: Array.isArray(placementRes.data) ? placementRes.data : placementRes.data?.attempts || []
      });
    } catch (error) {
      console.log("Error fetching attempts:", error);
      setAttempts({ exam: [], placement: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Sort attempts by date (latest first)
  const sortAttempts = (attempts) => {
    if (!Array.isArray(attempts)) return [];
    return [...attempts].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || 0);
      const dateB = new Date(b.createdAt || b.date || 0);
      return dateB - dateA;
    });
  };

  const getStatusStyle = (overall) => {
    if (isDarkMode) {
      if (overall >= 80) return { color: "#fff", bg: "#10b981", label: "Ready" };
      if (overall >= 60) return { color: "#fff", bg: "#f59e0b", label: "Moderately Ready" };
      return { color: "#fff", bg: "#ef4444", label: "Not Ready" };
    } else {
      if (overall >= 80) return { color: "#10B981", bg: "#D1FAE5", label: "Ready" };
      if (overall >= 60) return { color: "#F59E0B", bg: "#FEF3C7", label: "Moderately Ready" };
      return { color: "#EF4444", bg: "#FEE2E2", label: "Not Ready" };
    }
  };

  if (profileCheckLoading && user?.role !== "admin") {
    return <div style={{ background: theme.bg, minHeight: "100vh" }}></div>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        color: theme.mainText,
        display: "flex",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      <Sidebar
        navItems={getDashboardNav()}
        showLogout={true}
        onLogout={handleLogout}
        userName={user?.name || "Student"}
      />

      <main
        style={{
          marginLeft: "280px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "40px 20px",
          overflowY: "auto",
        }}
      >
        <h1 style={{ marginBottom: "40px", fontSize: "36px", fontWeight: "bold", textAlign: "center" }}>
          📊 My Assessment Results
        </h1>

        {loading ? (
          <p style={{ textAlign: "center", fontSize: "18px", color: "#cbd5e1" }}>Loading your results...</p>
        ) : (
          <div style={{ display: "grid", gap: "40px" }}>
            {/* EXAM READINESS SECTION */}
            <div>
              <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px", color: isDarkMode ? "#60a5fa" : "#3b82f6" }}>
                📝 Exam Readiness Attempts
              </h2>
              {sortAttempts(attempts.exam).length > 0 ? (
                <div style={{ overflowX: "auto", backgroundColor: theme.cardBg, borderRadius: "12px", padding: "20px", border: theme.cardBorder !== "none" ? theme.cardBorder : "1px solid #E2E8F0", boxShadow: theme.cardShadow }}>
                  <table
                    style={{
                      width: "100%",
                      color: theme.mainText,
                      fontSize: "14px",
                      borderCollapse: "collapse",
                    }}
                  >
                    <thead>
                      <tr style={{ borderBottom: `2px solid ${isDarkMode ? "#3b82f6" : "#E2E8F0"}`, backgroundColor: theme.tableHeaderBg }}>
                        <th style={{ padding: "12px", textAlign: "left", color: isDarkMode ? "#60a5fa" : "#64748B", fontWeight: "600" }}>Internal Avg</th>
                        <th style={{ padding: "12px", textAlign: "left", color: isDarkMode ? "#60a5fa" : "#64748B", fontWeight: "600" }}>Assignment Avg</th>
                        <th style={{ padding: "12px", textAlign: "left", color: isDarkMode ? "#60a5fa" : "#64748B", fontWeight: "600" }}>Attendance Avg</th>
                        <th style={{ padding: "12px", textAlign: "left", color: isDarkMode ? "#60a5fa" : "#64748B", fontWeight: "600" }}>Study Hours Avg</th>
                        <th style={{ padding: "12px", textAlign: "left", color: isDarkMode ? "#60a5fa" : "#64748B", fontWeight: "600" }}>Overall %</th>
                        <th style={{ padding: "12px", textAlign: "left", color: isDarkMode ? "#60a5fa" : "#64748B", fontWeight: "600" }}>Status</th>
                        <th style={{ padding: "12px", textAlign: "left", color: isDarkMode ? "#60a5fa" : "#64748B", fontWeight: "600" }}>Date</th>
                        <th style={{ padding: "12px", textAlign: "left", color: isDarkMode ? "#60a5fa" : "#64748B", fontWeight: "600" }}>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortAttempts(attempts.exam).map((attempt, idx) => {
                        const avgs = calculateAverages(attempt.subjects);
                        return (
                          <React.Fragment key={idx}>
                            <tr
                              style={{
                                borderBottom: `1px solid ${theme.tableBorder}`,
                                backgroundColor: idx % 2 === 0 ? theme.tableRowHover : "transparent",
                              }}
                            >
                              <td style={{ padding: "12px" }}>
                                {attempt.avgInternalMarks || avgs.internal}{attempt.avgInternalMarks || avgs.internal !== "-" ? "%" : ""}
                              </td>
                              <td style={{ padding: "12px" }}>
                                {attempt.avgAssignmentCompletion || avgs.assignment}{attempt.avgAssignmentCompletion || avgs.assignment !== "-" ? "%" : ""}
                              </td>
                              <td style={{ padding: "12px" }}>
                                {attempt.avgAttendance || avgs.attendance}{attempt.avgAttendance || avgs.attendance !== "-" ? "%" : ""}
                              </td>
                              <td style={{ padding: "12px" }}>
                                {attempt.avgStudyHours || avgs.studyHours}
                              </td>
                              <td style={{ padding: "12px", fontWeight: "bold" }}>
                                {attempt.overall || "-"}%
                              </td>
                              <td style={{ padding: "12px" }}>
                                <span
                                  style={{
                                    backgroundColor: getStatusStyle(attempt.overall || 0).bg,
                                    color: getStatusStyle(attempt.overall || 0).color,
                                    padding: "4px 12px",
                                    borderRadius: "4px",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                  }}
                                >
                                  {getStatusStyle(attempt.overall || 0).label}
                                </span>
                              </td>
                              <td style={{ padding: "12px", fontSize: "12px", color: theme.mainText }}>
                                {attempt.createdAt
                                  ? new Date(attempt.createdAt).toLocaleDateString()
                                  : "-"}
                              </td>
                              <td style={{ padding: "12px" }}>
                                <Button
                                  variant={isDarkMode ? "outline-primary" : "primary"}
                                  size="sm"
                                  onClick={() => toggleExamRow(idx)}
                                  style={{
                                    fontSize: "12px",
                                    padding: "2px 10px",
                                    backgroundColor: isDarkMode ? "transparent" : theme.primaryButton,
                                    borderColor: theme.primaryButton,
                                    color: isDarkMode ? theme.primaryButton : "#fff",
                                  }}
                                >
                                  {expandedExamRow === idx ? "Hide" : "View"}
                                </Button>
                              </td>
                            </tr>
                            {expandedExamRow === idx && (
                              <tr>
                                <td colSpan="8" style={{ padding: "0" }}>
                                  <div
                                    style={{
                                      padding: "15px 20px",
                                      background: theme.cardBg,
                                      margin: "10px",
                                      borderRadius: "8px",
                                      border: theme.cardBorder,
                                      boxShadow: theme.cardShadow
                                    }}
                                  >
                                    <h4 style={{ color: isDarkMode ? "#60a5fa" : "#3B82F6", fontSize: "16px", marginBottom: "15px" }}>Subject-wise Breakdown</h4>
                                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                                      <thead>
                                        <tr style={{ borderBottom: "1px solid #3b82f6" }}>
                                          <th style={{ padding: "8px", textAlign: "left", color: isDarkMode ? "#60a5fa" : "#3B82F6", borderBottom: `1px solid ${isDarkMode ? "#3b82f6" : theme.tableBorder}` }}>Subject Code</th>
                                          <th style={{ padding: "8px", textAlign: "left", color: isDarkMode ? "#60a5fa" : "#3B82F6" }}>Subject Name</th>
                                          <th style={{ padding: "8px", textAlign: "center", color: isDarkMode ? "#60a5fa" : "#3B82F6" }}>Internal</th>
                                          <th style={{ padding: "8px", textAlign: "center", color: isDarkMode ? "#60a5fa" : "#3B82F6" }}>Assignment</th>
                                          <th style={{ padding: "8px", textAlign: "center", color: isDarkMode ? "#60a5fa" : "#3B82F6" }}>Attendance</th>
                                          <th style={{ padding: "8px", textAlign: "center", color: isDarkMode ? "#60a5fa" : "#3B82F6" }}>Study Hours</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {attempt.subjects?.map((sub, sIdx) => (
                                          <tr key={sIdx} style={{ borderBottom: `1px solid ${theme.tableBorder}` }}>
                                            <td style={{ padding: "8px" }}>{sub.code}</td>
                                            <td style={{ padding: "8px" }}>{sub.name}</td>
                                            <td style={{ padding: "8px", textAlign: "center" }}>{sub.internalMarks}%</td>
                                            <td style={{ padding: "8px", textAlign: "center" }}>{sub.assignmentCompletion}%</td>
                                            <td style={{ padding: "8px", textAlign: "center" }}>{sub.attendance}%</td>
                                            <td style={{ padding: "8px", textAlign: "center" }}>{sub.studyHours}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Card
                  style={{
                    background: theme.cardBg,
                    borderRadius: "12px",
                    backdropFilter: "blur(10px)",
                    padding: "30px",
                    color: theme.mainText,
                    textAlign: "center",
                    border: theme.cardBorder !== "none" ? theme.cardBorder : "1px solid rgba(203, 213, 225, 0.2)",
                  }}
                >
                  <p style={{ fontSize: "18px", margin: "20px 0" }}>No exam readiness assessments yet.</p>
                  <Button
                    onClick={() => navigate("/exam-readiness")}
                    style={{
                      background: "linear-gradient(135deg, #3b82f6, #1e40af)",
                      border: "none",
                      color: "#fff",
                      padding: "10px 20px",
                      borderRadius: "8px",
                    }}
                  >
                    Take Exam Assessment
                  </Button>
                </Card>
              )}
            </div>

            {/* PLACEMENT READINESS SECTION */}
            <div>
              <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px", color: isDarkMode ? "#34d399" : "#10B981" }}>
                💼 Placement Readiness Attempts
              </h2>
              {sortAttempts(attempts.placement).length > 0 ? (
                <div style={{ overflowX: "auto", backgroundColor: theme.cardBg, borderRadius: "12px", padding: "20px", border: theme.cardBorder !== "none" ? theme.cardBorder : "1px solid #E2E8F0", boxShadow: theme.cardShadow }}>
                  <table
                    style={{
                      width: "100%",
                      color: theme.mainText,
                      fontSize: "14px",
                      borderCollapse: "collapse",
                    }}
                  >
                    <thead>
                      <tr style={{ borderBottom: `2px solid ${isDarkMode ? "#10b981" : "#E2E8F0"}`, backgroundColor: theme.tableHeaderBg }}>
                        <th style={{ padding: "12px", textAlign: "left", color: isDarkMode ? "#34d399" : "#64748B", fontWeight: "600" }}>
                          Aptitude
                        </th>
                        <th style={{ padding: "12px", textAlign: "left", color: isDarkMode ? "#34d399" : "#64748B", fontWeight: "600" }}>
                          Technical
                        </th>
                        <th style={{ padding: "12px", textAlign: "left", color: isDarkMode ? "#34d399" : "#64748B", fontWeight: "600" }}>
                          Communication
                        </th>
                        <th style={{ padding: "12px", textAlign: "left", color: isDarkMode ? "#34d399" : "#64748B", fontWeight: "600" }}>
                          Coding
                        </th>
                        <th style={{ padding: "12px", textAlign: "left", color: isDarkMode ? "#34d399" : "#64748B", fontWeight: "600" }}>
                          Overall %
                        </th>
                        <th style={{ padding: "12px", textAlign: "left", color: isDarkMode ? "#34d399" : "#64748B", fontWeight: "600" }}>
                          Status
                        </th>
                        <th style={{ padding: "12px", textAlign: "left", color: isDarkMode ? "#34d399" : "#64748B", fontWeight: "600" }}>
                          Date
                        </th>
                        <th style={{ padding: "12px", textAlign: "left", color: isDarkMode ? "#34d399" : "#64748B", fontWeight: "600" }}>
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortAttempts(attempts.placement).map((attempt, idx) => (
                        <React.Fragment key={idx}>
                          <tr
                            style={{
                              borderBottom: `1px solid ${theme.tableBorder}`,
                              backgroundColor: idx % 2 === 0 ? theme.tableRowHover : "transparent",
                            }}
                          >
                            <td style={{ padding: "12px", color: theme.mainText }}>
                              {attempt.aptitudeScore || "-"}
                            </td>
                            <td style={{ padding: "12px", color: theme.mainText }}>
                              {attempt.codingScore || "-"}
                            </td>
                            <td style={{ padding: "12px", color: theme.mainText }}>
                              {attempt.communicationScore || "-"}
                            </td>
                            <td style={{ padding: "12px", color: theme.mainText }}>
                              {attempt.attendanceScore || "-"}
                            </td>
                            <td style={{ padding: "12px", fontWeight: "bold", color: theme.mainText }}>
                              {attempt.overall || "-"}%
                            </td>
                            <td style={{ padding: "12px" }}>
                              <span
                                style={{
                                  backgroundColor: getStatusStyle(attempt.overall || 0).bg,
                                  color: getStatusStyle(attempt.overall || 0).color,
                                  padding: "4px 12px",
                                  borderRadius: "4px",
                                  fontSize: "12px",
                                  fontWeight: "600",
                                }}
                              >
                                {getStatusStyle(attempt.overall || 0).label}
                              </span>
                            </td>
                            <td style={{ padding: "12px", fontSize: "12px", color: theme.mainText }}>
                              {attempt.createdAt
                                ? new Date(attempt.createdAt).toLocaleDateString()
                                : "-"}
                            </td>
                            <td style={{ padding: "12px" }}>
                              <Button
                                variant={isDarkMode ? "outline-success" : "success"}
                                size="sm"
                                onClick={() => togglePlacementRow(idx)}
                                style={{
                                  fontSize: "12px",
                                  padding: "2px 10px",
                                  backgroundColor: isDarkMode ? "transparent" : "#10b981",
                                  borderColor: "#10b981",
                                  color: isDarkMode ? "#10b981" : "#fff",
                                }}
                              >
                                {expandedPlacementRow === idx ? "Hide" : "View"}
                              </Button>
                            </td>
                          </tr>
                          {expandedPlacementRow === idx && (
                            <tr>
                              <td colSpan="8" style={{ padding: "10px", backgroundColor: isDarkMode ? "#020617" : "#F8FAFC" }}>
                                <div
                                  style={{
                                    padding: "15px 20px",
                                    background: theme.cardBg,
                                    margin: "10px",
                                    borderRadius: "8px",
                                    border: `1px solid ${isDarkMode ? "#10b981" : "#E2E8F0"}`,
                                    boxShadow: theme.cardShadow
                                  }}
                                >
                                  <h4 style={{ color: isDarkMode ? "#34d399" : "#1E293B", fontSize: "16px", marginBottom: "15px", fontWeight: "700" }}>
                                    <span>📈</span> Detailed Performance Breakdown
                                  </h4>
                                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
                                    {[
                                      { label: "Coding Assessment", val: attempt.codingAssessment },
                                      { label: "Problems Solved", val: attempt.problemsSolved },
                                      { label: "Mock Aptitude", val: attempt.mockAptitude },
                                      { label: "Logical Score", val: attempt.logicalScore },
                                      { label: "Mock Interview", val: attempt.mockInterview },
                                      { label: "GD Score", val: attempt.gdScore },
                                      { label: "Session Participation", val: attempt.sessionParticipation },
                                      { label: "Workshop Attendance", val: attempt.workshopAttendance }
                                    ].map((item, i) => (
                                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${theme.tableBorder}`, backgroundColor: "transparent" }}>
                                        <span style={{ color: theme.subText }}>{item.label}:</span>
                                        <span style={{ color: isDarkMode ? "#34d399" : "#10b981", fontWeight: "600" }}>{item.val || "0"}%</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Card
                  style={{
                    background: theme.cardBg,
                    borderRadius: "12px",
                    backdropFilter: "blur(10px)",
                    padding: "30px",
                    color: theme.mainText,
                    textAlign: "center",
                    border: theme.cardBorder !== "none" ? theme.cardBorder : "1px solid rgba(203, 213, 225, 0.2)",
                  }}
                >
                  <p style={{ fontSize: "18px", margin: "20px 0" }}>No placement readiness assessments yet.</p>
                  <Button
                    onClick={() => navigate("/placement-readiness")}
                    style={{
                      background: "linear-gradient(135deg, #10b981, #065f46)",
                      border: "none",
                      color: "#fff",
                      padding: "10px 20px",
                      borderRadius: "8px",
                    }}
                  >
                    Take Placement Assessment
                  </Button>
                </Card>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default MyResults;
