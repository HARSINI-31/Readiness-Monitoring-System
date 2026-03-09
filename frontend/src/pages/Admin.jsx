import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Table, Container, Tabs, Tab } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";

function Admin() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [assessments, setAssessments] = useState({ exam: [], placement: [] });
  const [loading, setLoading] = useState(true);
  const [examSearch, setExamSearch] = useState("");
  const [placementSearch, setPlacementSearch] = useState("");
  const [expandedExam, setExpandedExam] = useState(null);
  const [expandedPlacement, setExpandedPlacement] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, assessmentsRes] = await Promise.all([
        axios.get("http://localhost:5000/students"),
        axios.get("http://localhost:5000/all-assessments")
      ]);
      setStudents(studentsRes.data);
      setAssessments(assessmentsRes.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate("/");
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

  const getStatusColor = (overall) => {
    if (overall >= 85) return "#10b981";
    if (overall >= 70) return "#f59e0b";
    return "#ef4444";
  };

  const getStatusText = (overall) => {
    if (overall >= 85) return "Ready";
    if (overall >= 70) return "Moderately Ready";
    return "Not Ready";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b, #334155)",
        color: "#fff",
        display: "flex",
      }}
    >
      <Sidebar
        navItems={[
          { label: "Dashboard", path: "/admin", icon: "📊" },
        ]}
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
        <div className="row mb-5">
          <div className="col-md-4 mb-3">
            <Card
              className="shadow-lg border-0"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                backdropFilter: "blur(10px)",
                padding: "20px",
                textAlign: "center",
                color: "#fff",
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
              className="shadow-lg border-0"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                backdropFilter: "blur(10px)",
                padding: "20px",
                textAlign: "center",
                color: "#fff",
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
              className="shadow-lg border-0"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                backdropFilter: "blur(10px)",
                padding: "20px",
                textAlign: "center",
                color: "#fff",
              }}
            >
              <h3 style={{ fontSize: "48px", fontWeight: "bold", color: "#f59e0b" }}>
                1
              </h3>
              <p style={{ fontSize: "18px", margin: "10px 0" }}>Admin Users</p>
            </Card>
          </div>
        </div>

        {/* ===== Tabs Section ===== */}
        <Card
          className="shadow-lg border-0"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "12px",
            backdropFilter: "blur(10px)",
            color: "#fff",
            overflow: "hidden"
          }}
        >
          <Tabs
            defaultActiveKey="students"
            className="mb-3"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              padding: "15px",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px"
            }}
          >
            {/* Students Tab */}
            <Tab eventKey="students" title="👥 Registered Students" style={{ padding: "20px" }}>
              {loading ? (
                <p style={{ textAlign: "center", fontSize: "18px" }}>Loading students...</p>
              ) : students.length > 0 ? (
                <Table
                  striped
                  bordered
                  hover
                  style={{
                    color: "#fff",
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <thead>
                    <tr style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr key={index} style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td>
                          <span
                            style={{
                              background:
                                student.role === "admin" ? "#ef4444" : "#3b82f6",
                              padding: "5px 10px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: "bold",
                            }}
                          >
                            {student.role}
                          </span>
                        </td>
                        <td>
                          <Button
                            variant="outline-light"
                            size="sm"
                            style={{ borderColor: "#fff", color: "#fff" }}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p style={{ textAlign: "center", fontSize: "18px" }}>No students found</p>
              )}
            </Tab>

            {/* Exam Readiness Tab */}
            <Tab eventKey="exam" title="📝 Exam Readiness Results" style={{ padding: "20px" }}>
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
                        border: "2px solid #3b82f6",
                        backgroundColor: "#1e293b",
                        color: "#ffffff",
                        fontSize: "14px",
                        outline: "none",
                        transition: "all 0.3s ease",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#60a5fa")}
                      onBlur={(e) => (e.target.style.borderColor = "#3b82f6")}
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
                                backgroundColor: "#1e293b",
                                border: "2px solid #3b82f6",
                                borderRadius: "12px",
                                padding: "20px",
                                transition: "all 0.3s ease",
                                transform: isExpanded ? "scale(1.02)" : "scale(1)",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "#60a5fa";
                                e.currentTarget.style.boxShadow =
                                  "0 8px 24px rgba(59, 130, 246, 0.3)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "#3b82f6";
                                e.currentTarget.style.boxShadow = "none";
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                  <span style={{ fontSize: "32px" }}>📁</span>
                                  <div>
                                    <h3 style={{ color: "#fff", margin: 0, marginBottom: "8px" }}>
                                      {studentName}
                                    </h3>
                                    <div style={{ color: "#cbd5e1", fontSize: "14px" }}>
                                      <span style={{ marginRight: "20px" }}>
                                        Attempts: <strong>{sortedAttempts.length}</strong>
                                      </span>
                                      <span>
                                        Avg Score: <strong>{avgOverall}%</strong>
                                      </span>
                                    </div>
                                  </div>
                                </div>
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
                            </Card>

                            {isExpanded && (
                              <div
                                style={{
                                  marginTop: "12px",
                                  backgroundColor: "#0f172a",
                                  borderRadius: "12px",
                                  padding: "20px",
                                  border: "1px solid #334155",
                                  overflowX: "auto",
                                }}
                              >
                                <table
                                  style={{
                                    width: "100%",
                                    color: "#cbd5e1",
                                    fontSize: "14px",
                                    borderCollapse: "collapse",
                                  }}
                                >
                                  <thead>
                                    <tr style={{ borderBottom: "2px solid #3b82f6" }}>
                                      <th style={{ padding: "12px", textAlign: "left", color: "#60a5fa" }}>
                                        Internal
                                      </th>
                                      <th style={{ padding: "12px", textAlign: "left", color: "#60a5fa" }}>
                                        Completion %
                                      </th>
                                      <th style={{ padding: "12px", textAlign: "left", color: "#60a5fa" }}>
                                        Attendance %
                                      </th>
                                      <th style={{ padding: "12px", textAlign: "left", color: "#60a5fa" }}>
                                        Unit Test
                                      </th>
                                      <th style={{ padding: "12px", textAlign: "left", color: "#60a5fa" }}>
                                        Mid-Sem
                                      </th>
                                      <th style={{ padding: "12px", textAlign: "left", color: "#60a5fa" }}>
                                        Overall %
                                      </th>
                                      <th style={{ padding: "12px", textAlign: "left", color: "#60a5fa" }}>
                                        Status
                                      </th>
                                      <th style={{ padding: "12px", textAlign: "left", color: "#60a5fa" }}>
                                        Date
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sortedAttempts.map((attempt, idx) => (
                                      <tr
                                        key={idx}
                                        style={{
                                          borderBottom: "1px solid #334155",
                                          backgroundColor: idx % 2 === 0 ? "rgba(30, 41, 59, 0.5)" : "transparent",
                                        }}
                                      >
                                        <td style={{ padding: "12px" }}>
                                          {attempt.internalAssignments || "-"}
                                        </td>
                                        <td style={{ padding: "12px" }}>
                                          {attempt.assignmentCompletion || "-"}
                                        </td>
                                        <td style={{ padding: "12px" }}>
                                          {attempt.attendance || "-"}
                                        </td>
                                        <td style={{ padding: "12px" }}>
                                          {attempt.unitTestMarks || "-"}
                                        </td>
                                        <td style={{ padding: "12px" }}>
                                          {attempt.midSemExam || "-"}
                                        </td>
                                        <td style={{ padding: "12px", fontWeight: "bold" }}>
                                          {attempt.overall || "-"}%
                                        </td>
                                        <td style={{ padding: "12px" }}>
                                          <span
                                            style={{
                                              backgroundColor: getStatusColor(attempt.overall || 0),
                                              color: "#fff",
                                              padding: "4px 12px",
                                              borderRadius: "4px",
                                              fontSize: "12px",
                                              fontWeight: "600",
                                            }}
                                          >
                                            {getStatusText(attempt.overall || 0)}
                                          </span>
                                        </td>
                                        <td style={{ padding: "12px", fontSize: "12px" }}>
                                          {attempt.createdAt
                                            ? new Date(attempt.createdAt).toLocaleDateString()
                                            : "-"}
                                        </td>
                                      </tr>
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
                    <p style={{ textAlign: "center", fontSize: "18px", color: "#cbd5e1" }}>
                      ❌ No students found
                    </p>
                  );
                })()
              ) : (
                <p style={{ textAlign: "center", fontSize: "18px" }}>No exam assessments found</p>
              )}
            </Tab>

            {/* Placement Readiness Tab */}
            <Tab eventKey="placement" title="💼 Placement Readiness Results" style={{ padding: "20px" }}>
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
                        border: "2px solid #10b981",
                        backgroundColor: "#1e293b",
                        color: "#ffffff",
                        fontSize: "14px",
                        outline: "none",
                        transition: "all 0.3s ease",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#34d399")}
                      onBlur={(e) => (e.target.style.borderColor = "#10b981")}
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
                                backgroundColor: "#1e293b",
                                border: "2px solid #10b981",
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
                                    <h3 style={{ color: "#fff", margin: 0, marginBottom: "8px" }}>
                                      {studentName}
                                    </h3>
                                    <div style={{ color: "#cbd5e1", fontSize: "14px" }}>
                                      <span style={{ marginRight: "20px" }}>
                                        Attempts: <strong>{sortedAttempts.length}</strong>
                                      </span>
                                      <span>
                                        Avg Score: <strong>{avgOverall}%</strong>
                                      </span>
                                    </div>
                                  </div>
                                </div>
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
                            </Card>

                            {isExpanded && (
                              <div
                                style={{
                                  marginTop: "12px",
                                  backgroundColor: "#0f172a",
                                  borderRadius: "12px",
                                  padding: "20px",
                                  border: "1px solid #334155",
                                  overflowX: "auto",
                                }}
                              >
                                <table
                                  style={{
                                    width: "100%",
                                    color: "#cbd5e1",
                                    fontSize: "14px",
                                    borderCollapse: "collapse",
                                  }}
                                >
                                  <thead>
                                    <tr style={{ borderBottom: "2px solid #10b981" }}>
                                      <th style={{ padding: "12px", textAlign: "left", color: "#34d399" }}>
                                        Aptitude
                                      </th>
                                      <th style={{ padding: "12px", textAlign: "left", color: "#34d399" }}>
                                        Technical
                                      </th>
                                      <th style={{ padding: "12px", textAlign: "left", color: "#34d399" }}>
                                        Communication
                                      </th>
                                      <th style={{ padding: "12px", textAlign: "left", color: "#34d399" }}>
                                        Coding
                                      </th>
                                      <th style={{ padding: "12px", textAlign: "left", color: "#34d399" }}>
                                        Overall %
                                      </th>
                                      <th style={{ padding: "12px", textAlign: "left", color: "#34d399" }}>
                                        Status
                                      </th>
                                      <th style={{ padding: "12px", textAlign: "left", color: "#34d399" }}>
                                        Date
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sortedAttempts.map((attempt, idx) => (
                                      <tr
                                        key={idx}
                                        style={{
                                          borderBottom: "1px solid #334155",
                                          backgroundColor: idx % 2 === 0 ? "rgba(30, 41, 59, 0.5)" : "transparent",
                                        }}
                                      >
                                        <td style={{ padding: "12px" }}>
                                          {attempt.aptitudeScore || "-"}
                                        </td>
                                        <td style={{ padding: "12px" }}>
                                          {attempt.codingScore || "-"}
                                        </td>
                                        <td style={{ padding: "12px" }}>
                                          {attempt.communicationScore || "-"}
                                        </td>
                                        <td style={{ padding: "12px" }}>
                                          {attempt.attendanceScore || "-"}
                                        </td>
                                        <td style={{ padding: "12px", fontWeight: "bold" }}>
                                          {attempt.overall || "-"}%
                                        </td>
                                        <td style={{ padding: "12px" }}>
                                          <span
                                            style={{
                                              backgroundColor: getStatusColor(attempt.overall || 0),
                                              color: "#fff",
                                              padding: "4px 12px",
                                              borderRadius: "4px",
                                              fontSize: "12px",
                                              fontWeight: "600",
                                            }}
                                          >
                                            {getStatusText(attempt.overall || 0)}
                                          </span>
                                        </td>
                                        <td style={{ padding: "12px", fontSize: "12px" }}>
                                          {attempt.createdAt
                                            ? new Date(attempt.createdAt).toLocaleDateString()
                                            : "-"}
                                        </td>
                                      </tr>
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
                    <p style={{ textAlign: "center", fontSize: "18px", color: "#cbd5e1" }}>
                      ❌ No students found
                    </p>
                  );
                })()
              ) : (
                <p style={{ textAlign: "center", fontSize: "18px" }}>No placement assessments found</p>
              )}
            </Tab>
          </Tabs>
        </Card>

        {/* ===== Footer Action ===== */}
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <Button
            variant="light"
            size="lg"
            onClick={() => navigate("/")}
            style={{
              background: "#3b82f6",
              border: "none",
              color: "#fff",
              fontSize: "16px",
              padding: "12px 30px",
              borderRadius: "8px",
            }}
          >
            Back to Home
          </Button>
        </div>
      </main>
    </div>
  );
}

export default Admin;
