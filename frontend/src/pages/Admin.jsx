import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Button, Table } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../context/ThemeContext";
import { useUser } from "../context/UserContext";
import { getAdminNav } from "../utils/navConfig";

const API = process.env.REACT_APP_API_URL;

function Admin() {
  const navigate = useNavigate();
  const { logout } = useUser();
  const { tab } = useParams();
  const [students, setStudents] = useState([]);
  const [assessments, setAssessments] = useState({ exam: [], placement: [] });
  const [contactMessages, setContactMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [examSearch, setExamSearch] = useState("");
  const [placementSearch, setPlacementSearch] = useState("");
  const [expandedExam, setExpandedExam] = useState(null);
  const [expandedPlacement, setExpandedPlacement] = useState(null);
  const [expandedAttempt, setExpandedAttempt] = useState(null);
  const { isDarkMode, theme } = useTheme();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, assessmentsRes, contactRes] = await Promise.all([
        axios.get(`${API}/students`),
        axios.get(`${API}/all-assessments`),
        axios.get(`${API}/api/contact`)
      ]);
      setStudents(studentsRes.data);
      setAssessments(assessmentsRes.data);
      setContactMessages(contactRes.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate("/", { replace: true });
    logout();
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`${API}/students/${studentId}`);
        setStudents(students.filter(student => student._id !== studentId));
        alert("Student deleted successfully");
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("Failed to delete student");
      }
    }
  };

  // Group results by student
  const groupByStudent = (results) => {
    return results.reduce((acc, result) => {
      const studentName = result.studentName || "Unknown";
      if (!acc[studentName]) {
        acc[studentName] = [];
      }
      acc[studentName].push(result);
      return acc;
    }, {});
  };

  // Sort attempts by date (latest first)
  const sortAttempts = (attempts) => {
    return [...attempts].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || 0);
      const dateB = new Date(b.createdAt || b.date || 0);
      return dateB - dateA;
    });
  };

  const getStatusStyle = (overall) => {
    if (isDarkMode) {
      if (overall >= 85) return { color: "#fff", bg: "#10b981", label: "Ready" };
      if (overall >= 70) return { color: "#fff", bg: "#f59e0b", label: "Moderately Ready" };
      return { color: "#fff", bg: "#ef4444", label: "Not Ready" };
    } else {
      if (overall >= 85) return { color: "#10B981", bg: "#D1FAE5", label: "Ready" };
      if (overall >= 70) return { color: "#F59E0B", bg: "#FEF3C7", label: "Moderately Ready" };
      return { color: "#EF4444", bg: "#FEE2E2", label: "Not Ready" };
    }
  };



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
        navItems={getAdminNav()}
        showLogout={true}
        onLogout={handleLogout}
        userName="Admin"
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
        {/* ===== Main Content ===== */}
        {/* ===== Stats Section ===== */}
        {(!tab || tab === "dashboard") && (
          <div className="row mb-5">
            <div className="col-md-4 mb-3">
              <Card
                className="shadow-lg"
                style={{
                  background: theme.cardBg,
                  borderRadius: "12px",
                  border: theme.cardBorder !== "none" ? theme.cardBorder : "none",
                  backdropFilter: "blur(10px)",
                  padding: "20px",
                  textAlign: "center",
                  color: theme.mainText,
                }}
              >
                <h3 style={{ fontSize: "48px", fontWeight: "bold", color: "#3b82f6" }}>
                  {students.length}
                </h3>
                <p style={{ fontSize: "18px", margin: "10px 0" }}>Total Students</p>
              </Card>
            </div>

            <div className="col-md-4 mb-3">
              <Card
                className="shadow-lg"
                style={{
                  background: theme.cardBg,
                  borderRadius: "12px",
                  border: theme.cardBorder !== "none" ? theme.cardBorder : "none",
                  backdropFilter: "blur(10px)",
                  padding: "20px",
                  textAlign: "center",
                  color: theme.mainText,
                }}
              >
                <h3 style={{ fontSize: "48px", fontWeight: "bold", color: "#10b981" }}>
                  {students.filter((s) => s.role === "student").length}
                </h3>
                <p style={{ fontSize: "18px", margin: "10px 0" }}>Active Students</p>
              </Card>
            </div>

            <div className="col-md-4 mb-3">
              <Card
                className="shadow-lg"
                style={{
                  background: theme.cardBg,
                  borderRadius: "12px",
                  border: theme.cardBorder !== "none" ? theme.cardBorder : "none",
                  backdropFilter: "blur(10px)",
                  padding: "20px",
                  textAlign: "center",
                  color: theme.mainText,
                }}
              >
                <h3 style={{ fontSize: "48px", fontWeight: "bold", color: "#f59e0b" }}>
                  1
                </h3>
                <p style={{ fontSize: "18px", margin: "10px 0" }}>Admin Users</p>
              </Card>
            </div>
          </div>
        )}

        {/* ===== Tabs Section ===== */}
        <Card
          className="shadow-lg"
          style={{
            background: theme.cardBg,
            borderRadius: "12px",
            border: theme.cardBorder !== "none" ? theme.cardBorder : "none",
            backdropFilter: "blur(10px)",
            color: theme.mainText,
            overflow: "hidden"
          }}
        >
          <div style={{ padding: "20px" }}>
            {(!tab || tab === "dashboard" || tab === "students") && (
              <div>
                <h2 style={{ marginBottom: "20px", color: theme.mainText, fontWeight: "bold" }}>
                  Registered Students
                </h2>
                {loading ? (
                  <p style={{ textAlign: "center", fontSize: "18px" }}>Loading students...</p>
                ) : students.length > 0 ? (
                  (() => {
                    const groupedStudents = students.reduce((acc, student) => {
                      const dept = student.department && student.department !== "N/A" ? student.department : "Unknown";
                      if (!acc[dept]) acc[dept] = [];
                      acc[dept].push(student);
                      return acc;
                    }, {});

                    return Object.entries(groupedStudents)
                      .sort(([deptA], [deptB]) => deptA.localeCompare(deptB))
                      .map(([dept, deptStudents]) => (
                        <div key={dept} style={{ marginBottom: "40px" }}>
                          <h3 style={{ color: theme.mainText, marginBottom: "15px", borderBottom: `2px solid ${theme.cardBorder === 'none' ? '#3b82f6' : theme.cardBorder}`, paddingBottom: "10px" }}>
                            {dept} Department
                          </h3>
                          <Table
                            striped
                            bordered
                            hover
                            style={{
                              color: theme.mainText,
                              borderColor: theme.tableBorder,
                            }}
                          >
                            <thead>
                              <tr style={{ borderColor: theme.tableBorder, backgroundColor: theme.tableHeaderBg }}>
                                <th style={{ color: theme.mainText, fontWeight: "600" }}>Student ID</th>
                                <th style={{ color: theme.mainText, fontWeight: "600" }}>Name</th>
                                <th style={{ color: theme.mainText, fontWeight: "600" }}>Email</th>
                                <th style={{ color: theme.mainText, fontWeight: "600" }}>Phone Number</th>
                                <th style={{ color: theme.mainText, fontWeight: "600" }}>Department</th>
                                <th style={{ color: theme.mainText, fontWeight: "600" }}>Year</th>
                                <th style={{ color: theme.mainText, fontWeight: "600" }}>Registered Date</th>
                                <th style={{ color: theme.mainText, fontWeight: "600" }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {deptStudents.map((student, index) => (
                                <React.Fragment key={index}>
                                  <tr key={index} style={{ borderColor: theme.tableBorder, backgroundColor: theme.cardBg }}>
                                    <td>{student.studentId || "-"}</td>
                                    <td>{student.name}</td>
                                    <td>{student.email}</td>
                                    <td>{student.phone || "-"}</td>
                                    <td>{student.department || "-"}</td>
                                    <td>{student.yearOfStudy || "-"}</td>
                                    <td>{student.registeredDate ? new Date(student.registeredDate).toLocaleDateString() : "-"}</td>
                                    <td>
                                      <div style={{ display: "flex", gap: "8px" }}>
                                        <Button
                                          variant="outline-danger"
                                          size="sm"
                                          onClick={() => handleDeleteStudent(student._id)}
                                        >
                                          Delete
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                                </React.Fragment>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      ));
                  })()
                ) : (
                  <p style={{ textAlign: "center", fontSize: "18px" }}>No students found</p>
                )}
              </div>
            )}

            {tab === "exam" && (
              <div>
                {/* Search Bar */}
                <div style={{ marginBottom: "30px" }}>
                  <div style={{ display: "flex", gap: "10px", maxWidth: "500px" }}>
                    <div style={{ flex: 1, position: "relative" }}>
                      <input
                        type="text"
                        placeholder="Search by student name..."
                        value={examSearch}
                        onChange={(e) => setExamSearch(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          borderRadius: "8px",
                          border: `2px solid ${isDarkMode ? "#3b82f6" : "#E2E8F0"}`,
                          backgroundColor: theme.inputBg,
                          color: theme.inputText,
                          fontSize: "14px",
                          outline: "none",
                          transition: "all 0.3s ease",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                        onBlur={(e) => (e.target.style.borderColor = isDarkMode ? "#3b82f6" : "#E2E8F0")}
                      />
                    </div>
                    {examSearch && (
                      <button
                        onClick={() => setExamSearch("")}
                        style={{
                          padding: "12px 16px",
                          backgroundColor: "#ef4444",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "600",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#dc2626")}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#ef4444")}
                      >
                        ✕ Clear
                      </button>
                    )}
                  </div>
                </div>

                {loading ? (
                  <p style={{ textAlign: "center", fontSize: "18px" }}>Loading results...</p>
                ) : assessments.exam.length > 0 ? (
                  (() => {
                    const grouped = groupByStudent(assessments.exam);
                    const filtered = Object.entries(grouped).filter(([name]) =>
                      name.toLowerCase().includes(examSearch.toLowerCase())
                    );

                    return filtered.length > 0 ? (
                      <div style={{ display: "grid", gap: "16px" }}>
                        {filtered.map(([studentName, attempts]) => {
                          const isExpanded = expandedExam === studentName;
                          const sortedAttempts = sortAttempts(attempts);
                          const avgOverall = (
                            sortedAttempts.reduce((sum, a) => sum + (a.overall || 0), 0) /
                            sortedAttempts.length
                          ).toFixed(1);

                          return (
                            <div key={studentName}>
                              <Card
                                onClick={() =>
                                  setExpandedExam(isExpanded ? null : studentName)
                                }
                                style={{
                                  cursor: "pointer",
                                  backgroundColor: theme.cardBg,
                                  border: theme.cardBorder !== "none" ? theme.cardBorder : `2px solid ${isDarkMode ? "#3b82f6" : "#E2E8F0"}`,
                                  borderRadius: "12px",
                                  padding: "20px",
                                  transition: "all 0.3s ease",
                                  transform: isExpanded ? "scale(1.01)" : "scale(1)",
                                  boxShadow: theme.cardShadow
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = "#3b82f6";
                                  if (isDarkMode) e.currentTarget.style.boxShadow = "0 8px 24px rgba(59, 130, 246, 0.3)";
                                  else e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = isDarkMode ? "#3b82f6" : "#E2E8F0";
                                  e.currentTarget.style.boxShadow = theme.cardShadow;
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                    <span style={{ fontSize: "32px" }}>📁</span>
                                    <div>
                                      <h3 style={{ color: theme.mainText, margin: 0, marginBottom: "8px" }}>
                                        {studentName}
                                      </h3>
                                      <div style={{ color: theme.subText, fontSize: "14px" }}>
                                        <span style={{ marginRight: "20px" }}>
                                          Attempts: <strong>{sortedAttempts.length}</strong>
                                        </span>
                                        <span>
                                          Avg Score: <strong>{avgOverall}%</strong>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                    <div
                                      style={{
                                        fontSize: "24px",
                                        transition: "transform 0.3s ease",
                                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                                      }}
                                    >
                                      ▼
                                    </div>
                                  </div>
                                </div>
                              </Card>

                              {isExpanded && (
                                <div
                                  style={{
                                    marginTop: "12px",
                                    backgroundColor: isDarkMode ? "#0f172a" : "#FFFFFF",
                                    borderRadius: "12px",
                                    padding: "20px",
                                    border: theme.cardBorder !== "none" ? theme.cardBorder : "1px solid #E2E8F0",
                                    overflowX: "auto",
                                    boxShadow: theme.cardShadow
                                  }}
                                >
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
                                        <th style={{ padding: "12px", textAlign: "left", color: isDarkMode ? "#60a5fa" : "#64748B", fontWeight: "600" }}>
                                          Internal Avg
                                        </th>
                                        <th style={{ padding: "12px", textAlign: "left", color: isDarkMode ? "#60a5fa" : "#64748B", fontWeight: "600" }}>
                                          Assignment Avg
                                        </th>
                                        <th style={{ padding: "12px", textAlign: "left", color: isDarkMode ? "#60a5fa" : "#64748B", fontWeight: "600" }}>
                                          Attendance Avg
                                        </th>
                                        <th style={{ padding: "12px", textAlign: "left", color: isDarkMode ? "#60a5fa" : "#64748B", fontWeight: "600" }}>
                                          Study Hours Avg
                                        </th>
                                        <th style={{ padding: "12px", textAlign: "left", color: isDarkMode ? "#60a5fa" : "#64748B", fontWeight: "600" }}>
                                          Overall %
                                        </th>
                                        <th style={{ padding: "12px", textAlign: "left", color: isDarkMode ? "#60a5fa" : "#64748B", fontWeight: "600" }}>
                                          Status
                                        </th>
                                        <th style={{ padding: "12px", textAlign: "left", color: isDarkMode ? "#60a5fa" : "#64748B", fontWeight: "600" }}>
                                          Date
                                        </th>
                                        <th style={{ padding: "12px", textAlign: "left", color: isDarkMode ? "#60a5fa" : "#64748B", fontWeight: "600" }}>
                                          Details
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {sortedAttempts.map((attempt, idx) => (
                                        <React.Fragment key={idx}>
                                          <tr
                                            style={{
                                              borderBottom: `1px solid ${theme.tableBorder}`,
                                              backgroundColor: idx % 2 === 0 ? theme.tableRowHover : "transparent",
                                            }}
                                          >
                                            <td style={{ padding: "12px" }}>
                                              {attempt.avgInternalMarks || "-"}%
                                            </td>
                                            <td style={{ padding: "12px" }}>
                                              {attempt.avgAssignmentCompletion || "-"}%
                                            </td>
                                            <td style={{ padding: "12px" }}>
                                              {attempt.avgAttendance || "-"}%
                                            </td>
                                            <td style={{ padding: "12px" }}>
                                              {attempt.avgStudyHours || "-"}
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
                                            <td style={{ padding: "12px", fontSize: "12px" }}>
                                              {attempt.createdAt
                                                ? new Date(attempt.createdAt).toLocaleDateString()
                                                : "-"}
                                            </td>
                                            <td style={{ padding: "12px" }}>
                                              <Button
                                                variant={isDarkMode ? "outline-primary" : "primary"}
                                                size="sm"
                                                onClick={() => {
                                                  setExpandedAttempt(expandedAttempt === attempt._id ? null : attempt._id);
                                                }}
                                                style={{
                                                  backgroundColor: isDarkMode ? "transparent" : theme.primaryButton,
                                                  borderColor: theme.primaryButton,
                                                  color: isDarkMode ? theme.primaryButton : "#fff",
                                                }}
                                              >
                                                {expandedAttempt === attempt._id ? "Hide" : "View"}
                                              </Button>
                                            </td>
                                          </tr>
                                          {expandedAttempt === attempt._id && (
                                            <tr>
                                              <td colSpan="8" style={{ padding: "15px", backgroundColor: isDarkMode ? "#020617" : "#F8FAFC" }}>
                                                <div style={{ padding: "20px", borderRadius: "8px", border: `1px solid ${isDarkMode ? "#3b82f6" : "#E2E8F0"}`, backgroundColor: isDarkMode ? "rgba(59, 130, 246, 0.05)" : "#FFFFFF", boxShadow: theme.cardShadow }}>
                                                  <h5 style={{ color: isDarkMode ? "#60a5fa" : "#1E293B", marginBottom: "20px", fontSize: "18px", display: "flex", alignItems: "center", gap: "10px", fontWeight: "700" }}>
                                                    <span>📊</span> Subject-wise Performance Breakdown
                                                  </h5>

                                                  <div style={{ overflowX: "auto", marginBottom: "20px" }}>
                                                    <Table striped bordered hover variant={isDarkMode ? "dark" : "light"} size="sm" style={{ color: theme.mainText, fontSize: "14px", margin: 0 }}>
                                                      <thead>
                                                        <tr style={{ borderBottom: "2px solid #3b82f6", backgroundColor: "rgba(59, 130, 246, 0.1)" }}>
                                                          <th style={{ padding: "10px", textAlign: "left" }}>Code</th>
                                                          <th style={{ padding: "10px", textAlign: "left" }}>Subject</th>
                                                          <th style={{ padding: "10px", textAlign: "center" }}>Internal</th>
                                                          <th style={{ padding: "10px", textAlign: "center" }}>Assignment</th>
                                                          <th style={{ padding: "10px", textAlign: "center" }}>Attendance</th>
                                                          <th style={{ padding: "10px", textAlign: "center" }}>Study Hrs</th>
                                                        </tr>
                                                      </thead>
                                                      <tbody>
                                                        {(attempt.subjects || attempt.subjectDetails || []).map((sub, sIdx) => (
                                                          <tr key={sIdx} style={{ borderBottom: "1px solid #1e293b" }}>
                                                            <td style={{ padding: "10px", fontWeight: "bold", color: "#60a5fa" }}>{sub.code}</td>
                                                            <td style={{ padding: "10px" }}>{sub.name}</td>
                                                            <td style={{ padding: "10px", textAlign: "center" }}>{sub.internalMarks}%</td>
                                                            <td style={{ padding: "10px", textAlign: "center" }}>{sub.assignmentCompletion}%</td>
                                                            <td style={{ padding: "10px", textAlign: "center" }}>{sub.attendance}%</td>
                                                            <td style={{ padding: "10px", textAlign: "center" }}>{sub.studyHours}h</td>
                                                          </tr>
                                                        ))}
                                                      </tbody>
                                                    </Table>
                                                  </div>

                                                  <div style={{ padding: "15px", backgroundColor: "rgba(59, 130, 246, 0.1)", borderRadius: "8px" }}>
                                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", fontSize: "14px" }}>
                                                      <div><strong style={{ opacity: 0.8 }}>Internal Avg:</strong> <span style={{ color: "#60a5fa" }}>{attempt.avgInternalMarks}%</span></div>
                                                      <div><strong style={{ opacity: 0.8 }}>Assignment Avg:</strong> <span style={{ color: "#60a5fa" }}>{attempt.avgAssignmentCompletion}%</span></div>
                                                      <div><strong style={{ opacity: 0.8 }}>Overall Attendance:</strong> <span style={{ color: "#60a5fa" }}>{attempt.avgAttendance}%</span></div>
                                                      <div><strong style={{ opacity: 0.8 }}>Total Study Hours:</strong> <span style={{ color: "#60a5fa" }}>{attempt.avgStudyHours}h</span></div>
                                                    </div>
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
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p style={{ textAlign: "center", fontSize: "18px", color: theme.subText }}>
                        ❌ No students found
                      </p>
                    );
                  })()
                ) : (
                  <p style={{ textAlign: "center", fontSize: "18px" }}>No exam assessments found</p>
                )}
              </div>
            )}

            {tab === "placement" && (
              <div>
                {/* Search Bar */}
                <div style={{ marginBottom: "30px" }}>
                  <div style={{ display: "flex", gap: "10px", maxWidth: "500px" }}>
                    <div style={{ flex: 1, position: "relative" }}>
                      <input
                        type="text"
                        placeholder="Search by student name..."
                        value={placementSearch}
                        onChange={(e) => setPlacementSearch(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          borderRadius: "8px",
                          border: `2px solid ${isDarkMode ? "#10b981" : "#E2E8F0"}`,
                          backgroundColor: theme.inputBg,
                          color: theme.inputText,
                          fontSize: "14px",
                          outline: "none",
                          transition: "all 0.3s ease",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#10b981")}
                        onBlur={(e) => (e.target.style.borderColor = isDarkMode ? "#10b981" : "#E2E8F0")}
                      />
                    </div>
                    {placementSearch && (
                      <button
                        onClick={() => setPlacementSearch("")}
                        style={{
                          padding: "12px 16px",
                          backgroundColor: "#ef4444",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "600",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#dc2626")}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#ef4444")}
                      >
                        ✕ Clear
                      </button>
                    )}
                  </div>
                </div>

                {loading ? (
                  <p style={{ textAlign: "center", fontSize: "18px" }}>Loading results...</p>
                ) : assessments.placement.length > 0 ? (
                  (() => {
                    const grouped = groupByStudent(assessments.placement);
                    const filtered = Object.entries(grouped).filter(([name]) =>
                      name.toLowerCase().includes(placementSearch.toLowerCase())
                    );

                    return filtered.length > 0 ? (
                      <div style={{ display: "grid", gap: "16px" }}>
                        {filtered.map(([studentName, attempts]) => {
                          const isExpanded = expandedPlacement === studentName;
                          const sortedAttempts = sortAttempts(attempts);
                          const avgOverall = (
                            sortedAttempts.reduce((sum, a) => sum + (a.overall || 0), 0) /
                            sortedAttempts.length
                          ).toFixed(1);

                          return (
                            <div key={studentName}>
                              <Card
                                onClick={() =>
                                  setExpandedPlacement(isExpanded ? null : studentName)
                                }
                                style={{
                                  cursor: "pointer",
                                  backgroundColor: theme.cardBg,
                                  border: theme.cardBorder !== "none" ? theme.cardBorder : "2px solid #10b981",
                                  borderRadius: "12px",
                                  padding: "20px",
                                  transition: "all 0.3s ease",
                                  transform: isExpanded ? "scale(1.02)" : "scale(1)",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = "#34d399";
                                  e.currentTarget.style.boxShadow =
                                    "0 8px 24px rgba(16, 185, 129, 0.3)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = "#10b981";
                                  e.currentTarget.style.boxShadow = "none";
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                    <span style={{ fontSize: "32px" }}>📁</span>
                                    <div>
                                      <h3 style={{ color: theme.mainText, margin: 0, marginBottom: "8px" }}>
                                        {studentName}
                                      </h3>
                                      <div style={{ color: theme.subText, fontSize: "14px" }}>
                                        <span style={{ marginRight: "20px" }}>
                                          Attempts: <strong>{sortedAttempts.length}</strong>
                                        </span>
                                        <span>
                                          Avg Score: <strong>{avgOverall}%</strong>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                    <div
                                      style={{
                                        fontSize: "24px",
                                        transition: "transform 0.3s ease",
                                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                                      }}
                                    >
                                      ▼
                                    </div>
                                  </div>
                                </div>
                              </Card>

                              {isExpanded && (
                                <div
                                  style={{
                                    marginTop: "12px",
                                    backgroundColor: theme.cardBg,
                                    borderRadius: "12px",
                                    padding: "20px",
                                    border: theme.cardBorder !== "none" ? theme.cardBorder : "1px solid #E2E8F0",
                                    boxShadow: theme.cardShadow,
                                    overflowX: "auto",
                                  }}
                                >
                                  <table
                                    style={{
                                      width: "100%",
                                      color: theme.mainText,
                                      fontSize: "14px",
                                      borderCollapse: "collapse",
                                    }}
                                  >
                                    <thead>
                                      <tr style={{ borderBottom: "2px solid #10b981" }}>
                                        <th style={{ padding: "12px", textAlign: "left", color: isDarkMode ? "#34d399" : "#64748B" }}>Aptitude</th>
                                        <th style={{ padding: "12px", textAlign: "left", color: isDarkMode ? "#34d399" : "#64748B" }}>Technical</th>
                                        <th style={{ padding: "12px", textAlign: "left", color: isDarkMode ? "#34d399" : "#64748B" }}>Comm.</th>
                                        <th style={{ padding: "12px", textAlign: "left", color: isDarkMode ? "#34d399" : "#64748B" }}>Particip.</th>
                                        <th style={{ padding: "12px", textAlign: "left", color: isDarkMode ? "#34d399" : "#64748B" }}>Overall %</th>
                                        <th style={{ padding: "12px", textAlign: "left", color: isDarkMode ? "#34d399" : "#64748B" }}>Status</th>
                                        <th style={{ padding: "12px", textAlign: "left", color: isDarkMode ? "#34d399" : "#64748B" }}>Date</th>
                                        <th style={{ padding: "12px", textAlign: "left", color: isDarkMode ? "#34d399" : "#64748B" }}>Details</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {sortedAttempts.map((attempt, idx) => {
                                        return (
                                          <React.Fragment key={idx}>
                                            <tr
                                              style={{
                                                borderBottom: `1px solid ${theme.tableBorder}`,
                                                backgroundColor: idx % 2 === 0 ? theme.tableRowHover : "transparent",
                                              }}
                                            >
                                              <td style={{ padding: "12px" }}>{attempt.aptitudeScore || "-"}</td>
                                              <td style={{ padding: "12px" }}>{attempt.codingScore || "-"}</td>
                                              <td style={{ padding: "12px" }}>{attempt.communicationScore || "-"}</td>
                                              <td style={{ padding: "12px" }}>{attempt.attendanceScore || "-"}</td>
                                              <td style={{ padding: "12px", fontWeight: "bold" }}>{attempt.overall || "-"}%</td>
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
                                              <td style={{ padding: "12px", fontSize: "12px" }}>
                                                {attempt.createdAt ? new Date(attempt.createdAt).toLocaleDateString() : "-"}
                                              </td>
                                              <td style={{ padding: "12px" }}>
                                                <Button
                                                  variant="outline-success"
                                                  size="sm"
                                                  onClick={() => setExpandedAttempt(expandedAttempt === attempt._id ? null : attempt._id)}
                                                >
                                                  {expandedAttempt === attempt._id ? "Hide" : "View"}
                                                </Button>
                                              </td>
                                            </tr>
                                            {expandedAttempt === attempt._id && (
                                              <tr>
                                                <td colSpan="8" style={{ padding: "15px", backgroundColor: isDarkMode ? "#020617" : "#F8FAFC" }}>
                                                  <div style={{ padding: "20px", borderRadius: "8px", border: `1px solid ${isDarkMode ? "#10b981" : "#E2E8F0"}`, backgroundColor: theme.cardBg, boxShadow: theme.cardShadow }}>
                                                    <h5 style={{ color: isDarkMode ? "#34d399" : "#1E293B", marginBottom: "20px", fontSize: "18px", display: "flex", alignItems: "center", gap: "10px" }}>
                                                      <span>📈</span> Placement Assessment Breakdown
                                                    </h5>
                                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", color: theme.mainText }}>
                                                      <div><strong style={{ opacity: 0.8, color: theme.subText }}>Coding Assessment:</strong> <span style={{ color: isDarkMode ? "#34d399" : "#10b981", fontWeight: "600" }}>{attempt.codingAssessment || 0}%</span></div>
                                                      <div><strong style={{ opacity: 0.8, color: theme.subText }}>Problems Solved:</strong> <span style={{ color: isDarkMode ? "#34d399" : "#10b981", fontWeight: "600" }}>{attempt.problemsSolved || 0}%</span></div>
                                                      <div><strong style={{ opacity: 0.8, color: theme.subText }}>Mock Aptitude:</strong> <span style={{ color: isDarkMode ? "#34d399" : "#10b981", fontWeight: "600" }}>{attempt.mockAptitude || 0}%</span></div>
                                                      <div><strong style={{ opacity: 0.8, color: theme.subText }}>Logical Score:</strong> <span style={{ color: isDarkMode ? "#34d399" : "#10b981", fontWeight: "600" }}>{attempt.logicalScore || 0}%</span></div>
                                                      <div><strong style={{ opacity: 0.8, color: theme.subText }}>Mock Interview:</strong> <span style={{ color: isDarkMode ? "#34d399" : "#10b981", fontWeight: "600" }}>{attempt.mockInterview || 0}%</span></div>
                                                      <div><strong style={{ opacity: 0.8, color: theme.subText }}>GD Score:</strong> <span style={{ color: isDarkMode ? "#34d399" : "#10b981", fontWeight: "600" }}>{attempt.gdScore || 0}%</span></div>
                                                      <div><strong style={{ opacity: 0.8, color: theme.subText }}>Session Particip.:</strong> <span style={{ color: isDarkMode ? "#34d399" : "#10b981", fontWeight: "600" }}>{attempt.sessionParticipation || 0}%</span></div>
                                                      <div><strong style={{ opacity: 0.8, color: theme.subText }}>Workshop Attend.:</strong> <span style={{ color: isDarkMode ? "#34d399" : "#10b981", fontWeight: "600" }}>{attempt.workshopAttendance || 0}%</span></div>
                                                    </div>
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
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p style={{ textAlign: "center", fontSize: "18px", color: theme.subText }}>
                        ❌ No students found
                      </p>
                    );
                  })()
                ) : (
                  <p style={{ textAlign: "center", fontSize: "18px" }}>No placement assessments found</p>
                )}
              </div>
            )}

            {tab === "contact" && (
              <div>
                {loading ? (
                  <p style={{ textAlign: "center", fontSize: "18px" }}>Loading messages...</p>
                ) : contactMessages.length > 0 ? (
                  <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                    <Table
                      striped
                      bordered
                      hover
                      style={{
                        color: theme.mainText,
                        borderColor: theme.tableBorder,
                        backgroundColor: theme.cardBg
                      }}
                    >
                      <thead style={{ position: "sticky", top: 0, backgroundColor: theme.tableHeaderBg, zIndex: 1 }}>
                        <tr style={{ borderColor: theme.tableBorder, backgroundColor: theme.tableHeaderBg }}>
                          <th style={{ padding: "12px", color: theme.mainText, fontWeight: "600" }}>Name</th>
                          <th style={{ padding: "12px", color: theme.mainText, fontWeight: "600" }}>Email</th>
                          <th style={{ padding: "12px", color: theme.mainText, fontWeight: "600" }}>Subject</th>
                          <th style={{ padding: "12px", color: theme.mainText, fontWeight: "600" }}>Message</th>
                          <th style={{ padding: "12px", color: theme.mainText, fontWeight: "600" }}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contactMessages.map((message, index) => (
                          <tr key={index} style={{ borderColor: theme.tableBorder, backgroundColor: theme.cardBg }}>
                            <td style={{ padding: "12px", maxWidth: "150px", wordWrap: "break-word" }}>
                              {message.name}
                            </td>
                            <td style={{ padding: "12px", maxWidth: "200px", wordWrap: "break-word" }}>
                              {message.email}
                            </td>
                            <td style={{ padding: "12px", maxWidth: "150px", wordWrap: "break-word" }}>
                              {message.subject}
                            </td>
                            <td style={{ padding: "12px", maxWidth: "300px", wordWrap: "break-word" }}>
                              {message.message}
                            </td>
                            <td style={{ padding: "12px", minWidth: "120px" }}>
                              {message.createdAt
                                ? new Date(message.createdAt).toLocaleDateString() + " " + new Date(message.createdAt).toLocaleTimeString()
                                : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <p style={{ textAlign: "center", fontSize: "18px" }}>No contact messages found</p>
                )}
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}

export default Admin;
