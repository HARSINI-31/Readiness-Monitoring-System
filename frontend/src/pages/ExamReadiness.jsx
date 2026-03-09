import React, { useState, useEffect } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useUser } from "../context/UserContext";

function ExamReadiness() {
  const navigate = useNavigate();
  const { user, studentProfile, logout } = useUser();
  const isAdmin = user?.role === "admin" || user?.userType === "admin";

  // Student form data
  const [formData, setFormData] = useState({
    internalAssignments: "",
    assignmentCompletion: "",
    attendance: "",
    unitTestMarks: "",
    midSemExam: "",
  });

  // Admin view data
  const [allResults, setAllResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchAllExamResults();
    }
  }, [isAdmin]);

  const fetchAllExamResults = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/all-exam-results");
      setAllResults(res.data || []);
    } catch (error) {
      console.error("Error fetching exam results:", error);
      setAllResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Group results by student
  const groupedByStudent = allResults.reduce((acc, result) => {
    const studentName = result.studentName || "Unknown";
    if (!acc[studentName]) {
      acc[studentName] = [];
    }
    acc[studentName].push(result);
    return acc;
  }, {});

  // Filter students based on search query
  const filteredStudents = Object.entries(groupedByStudent).filter(([studentName]) =>
    studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort attempts by date (latest first)
  const sortAttempts = (attempts) => {
    return [...attempts].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || 0);
      const dateB = new Date(b.createdAt || b.date || 0);
      return dateB - dateA;
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/exam-calculate",
        {
          studentId: studentProfile?.studentId,
          studentEmail: user?.userEmail,
          studentName: user?.userName,
          ...formData
        }
      );
      navigate("/exam-results", { state: res.data });
    } catch (error) {
      console.error(error);
      alert("Error calculating exam readiness");
    }
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

  // ADMIN VIEW
  if (isAdmin) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a, #1e293b, #334155)", display: "flex" }}>
        <Sidebar
          navItems={[
            { label: "Home", path: "/", icon: "🏠" },
            { label: "Placement Readiness", path: "/placement-readiness", icon: "💼" },
            { label: "Admin Dashboard", path: "/admin", icon: "📊" },
          ]}
          showLogout={true}
          onLogout={handleLogout}
          userName={user?.name || "Admin"}
        />

        <main style={{ marginLeft: "280px", flex: 1, padding: "40px 20px", overflowY: "auto" }}>
          <h1 style={{ color: "#fff", fontSize: "36px", marginBottom: "30px", fontWeight: "bold" }}>
            📚 Exam Readiness Results
          </h1>

          {/* Search Bar */}
          <div style={{ marginBottom: "30px" }}>
            <div style={{ display: "flex", gap: "10px", maxWidth: "500px" }}>
              <div style={{ flex: 1, position: "relative" }}>
                <input
                  type="text"
                  placeholder="Search by student name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
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

          {/* Student Folders */}
          {loading ? (
            <div style={{ color: "#cbd5e1", textAlign: "center", padding: "40px" }}>
              Loading results...
            </div>
          ) : filteredStudents.length === 0 ? (
            <div
              style={{
                color: "#cbd5e1",
                textAlign: "center",
                padding: "40px",
                fontSize: "18px",
              }}
            >
              {searchQuery ? "❌ No students found" : "No results available"}
            </div>
          ) : (
            <div style={{ display: "grid", gap: "16px" }}>
              {filteredStudents.map(([studentName, attempts]) => {
                const isExpanded = expandedStudent === studentName;
                const sortedAttempts = sortAttempts(attempts);
                const latestAttempt = sortedAttempts[0];
                const avgOverall = (
                  sortedAttempts.reduce((sum, a) => sum + (a.overall || 0), 0) /
                  sortedAttempts.length
                ).toFixed(1);

                return (
                  <div key={studentName}>
                    {/* Student Folder Card */}
                    <Card
                      onClick={() =>
                        setExpandedStudent(isExpanded ? null : studentName)
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

                    {/* Expanded Details */}
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
                                    : attempt.date || "-"}
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
          )}
        </main>
      </div>
    );
  }

  // STUDENT VIEW (existing code)
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b, #334155)",
        display: "flex",
      }}
    >
      <Sidebar
        navItems={[
          { label: "Home", path: "/", icon: "🏠" },
          { label: "Placement Readiness", path: "/placement-readiness", icon: "💼" },
          { label: "My Results", path: "/my-results", icon: "📊" },
          { label: "Profile", path: "/student-profile", icon: "👤" },
        ]}
        showLogout={true}
        onLogout={handleLogout}
        userName={user?.name || "Student"}
      />

      {/* Main Content */}
      <main
        style={{
          marginLeft: "280px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <h1 style={{ color: "#fff", fontSize: "48px", marginBottom: "20px" }}>
          📝 Exam Readiness Assessment
        </h1>

        <p style={{ color: "#eee", fontSize: "20px", marginBottom: "40px" }}>
          Evaluate your preparation based on assignments and exam performance.
        </p>

        <Card
          className="p-5 shadow-lg"
          style={{ width: "500px", borderRadius: "20px" }}
        >
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Internal Assignment Marks (0-100)</Form.Label>
              <Form.Control
                type="number"
                name="internalAssignments"
                value={formData.internalAssignments}
                onChange={handleChange}
                placeholder="Enter marks"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Assignment Completion (%)</Form.Label>
              <Form.Control
                type="number"
                name="assignmentCompletion"
                value={formData.assignmentCompletion}
                onChange={handleChange}
                placeholder="Enter completion percentage"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Class Attendance (%)</Form.Label>
              <Form.Control
                type="number"
                name="attendance"
                value={formData.attendance}
                onChange={handleChange}
                placeholder="Enter attendance percentage"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Unit Test Marks (0-100)</Form.Label>
              <Form.Control
                type="number"
                name="unitTestMarks"
                value={formData.unitTestMarks}
                onChange={handleChange}
                placeholder="Enter unit test marks"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mid-Sem Exam Marks (0-100)</Form.Label>
              <Form.Control
                type="number"
                name="midSemExam"
                value={formData.midSemExam}
                onChange={handleChange}
                placeholder="Enter mid-semester marks"
              />
            </Form.Group>

            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              style={{ width: "100%", marginTop: "20px" }}
            >
              Calculate Readiness
            </Button>
          </Form>
        </Card>
      </main>
    </div>
  );
}

export default ExamReadiness;
