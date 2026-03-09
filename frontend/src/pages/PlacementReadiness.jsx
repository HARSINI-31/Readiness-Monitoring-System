import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Card, Button, Form } from "react-bootstrap";
import axios from "axios";
import { useUser } from "../context/UserContext";

function PlacementReadiness() {
  const navigate = useNavigate();
  const { user, studentProfile, logout } = useUser();
  const isAdmin = user?.role === "admin" || user?.userType === "admin";

  // Coding
  const [codingAssessment, setCodingAssessment] = useState("");
  const [problemsSolved, setProblemsSolved] = useState("");

  // Aptitude
  const [mockAptitude, setMockAptitude] = useState("");
  const [logicalScore, setLogicalScore] = useState("");

  // Communication
  const [mockInterview, setMockInterview] = useState("");
  const [gdScore, setGdScore] = useState("");

  // Attendance
  const [sessionParticipation, setSessionParticipation] = useState("");
  const [workshopAttendance, setWorkshopAttendance] = useState("");

  // Admin view data
  const [allResults, setAllResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchAllPlacementResults();
    }
  }, [isAdmin]);

  const fetchAllPlacementResults = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/all-placement-results");
      setAllResults(res.data || []);
    } catch (error) {
      console.error("Error fetching placement results:", error);
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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleCalculate = async () => {
    try {
      const response = await fetch("http://localhost:5000/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: studentProfile?.studentId,
          studentEmail: user?.userEmail,
          studentName: user?.userName,
          codingAssessment,
          problemsSolved,
          mockAptitude,
          logicalScore,
          mockInterview,
          gdScore,
          sessionParticipation,
          workshopAttendance
        })
      });

      const data = await response.json();
      navigate("/result", { state: data });

    } catch (error) {
      console.error("Calculation error:", error);
      alert("Failed to calculate readiness. Please try again.");
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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b, #334155)",
        display: "flex",
      }}
    >
      {/* ADMIN VIEW */}
      {isAdmin ? (
        <>
          <Sidebar
            navItems={[
              { label: "Home", path: "/", icon: "🏠" },
              { label: "Exam Readiness", path: "/exam-readiness", icon: "📚" },
              { label: "Admin Dashboard", path: "/admin", icon: "📊" },
            ]}
            showLogout={true}
            onLogout={handleLogout}
            userName={user?.name || "Admin"}
          />

          <main style={{ marginLeft: "280px", flex: 1, padding: "40px 20px", overflowY: "auto" }}>
            <h1 style={{ color: "#fff", fontSize: "36px", marginBottom: "30px", fontWeight: "bold" }}>
              💼 Placement Readiness Results
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
        </>
      ) : (
        /* STUDENT VIEW */
        <>
          <Sidebar
            navItems={[
              { label: "Home", path: "/", icon: "🏠" },
              { label: "Exam Readiness", path: "/exam-readiness", icon: "📚" },
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
            <h1
              style={{
                color: "#fff",
                fontSize: "42px",
                fontWeight: "700",
                marginBottom: "50px",
                textAlign: "center",
                textShadow: "2px 2px 8px rgba(0,0,0,0.4)"
              }}
            >
              Placement Readiness Assessment
            </h1>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "50px",
                maxWidth: "1200px"
              }}
            >
              {[
                {
                  title: "Coding Skills",
                  inputs: [
                    { value: codingAssessment, setter: setCodingAssessment, placeholder: "Coding Assessment Score (0-100)" },
                    { value: problemsSolved, setter: setProblemsSolved, placeholder: "Problems Solved % (0-100)" }
                  ]
                },
                {
                  title: "Aptitude Skills",
                  inputs: [
                    { value: mockAptitude, setter: setMockAptitude, placeholder: "Mock Aptitude Score (0-100)" },
                    { value: logicalScore, setter: setLogicalScore, placeholder: "Logical & Quant Score (0-100)" }
                  ]
                },
                {
                  title: "Communication Skills",
                  inputs: [
                    { value: mockInterview, setter: setMockInterview, placeholder: "Mock Interview Score (0-100)" },
                    { value: gdScore, setter: setGdScore, placeholder: "GD Score (0-100)" }
                  ]
                },
                {
                  title: "Participation",
                  inputs: [
                    { value: sessionParticipation, setter: setSessionParticipation, placeholder: "Session Participation % (0-100)" },
                    { value: workshopAttendance, setter: setWorkshopAttendance, placeholder: "Workshop Attendance % (0-100)" }
                  ]
                }
              ].map((section, index) => (
                <div
                  key={index}
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(14px)",
                    padding: "40px",
                    borderRadius: "25px",
                    width: "350px",
                    color: "#fff",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
                    border: "1px solid rgba(255,255,255,0.25)"
                  }}
                >
                  <h3
                    style={{
                      fontSize: "24px",
                      marginBottom: "25px",
                      fontWeight: "700",
                      textShadow: "1px 1px 5px rgba(0,0,0,0.3)"
                    }}
                  >
                    {section.title}
                  </h3>

                  {section.inputs.map((input, i) => (
                    <input
                      key={i}
                      type="number"
                      min="0"
                      max="100"
                      placeholder={input.placeholder}
                      value={input.value}
                      onChange={(e) => input.setter(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "14px",
                        margin: "12px 0",
                        borderRadius: "10px",
                        border: "1px solid #ccc",
                        fontSize: "16px",
                        background: "#FFFFFF",
                        color: "#000000",
                        textAlign: "center",
                        outline: "none",
                        boxShadow: "inset 0 2px 6px rgba(0,0,0,0.1)"
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>

            <button
              onClick={handleCalculate}
              style={{
                padding: "16px 50px",
                marginTop: "60px",
                fontSize: "20px",
                fontWeight: "700",
                borderRadius: "15px",
                border: "none",
                background: "linear-gradient(135deg, #1e3c72, #2a5298)",
                color: "#FFFFFF",
                cursor: "pointer",
                boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              Calculate Placement Readiness
            </button>
          </main>
        </>
      )}
    </div>
  );
}

export default PlacementReadiness;
