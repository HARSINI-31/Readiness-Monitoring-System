import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";
import { getDashboardNav } from "../utils/navConfig";

const API = process.env.REACT_APP_API_URL || "https://readiness-monitoring-system.onrender.com";

function PlacementReadiness() {
  const navigate = useNavigate();
  const { user, studentProfile, logout } = useUser();
  const isAdmin = user?.role === "admin" || user?.userType === "admin";
  const { theme } = useTheme();
  const [profileCheckLoading, setProfileCheckLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== "admin") {
      const isComplete = studentProfile &&
        studentProfile.studentId &&
        studentProfile.department &&
        studentProfile.yearOfStudy;

      if (!isComplete) {
        navigate("/student-profile", {
          state: { message: "Please complete your profile to access readiness assessments." }
        });
      } else {
        setProfileCheckLoading(false);
      }
    } else {
      setProfileCheckLoading(false);
    }
  }, [user, studentProfile, navigate]);


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
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    if (isAdmin) {
      fetchAllPlacementResults();
    }
  }, [isAdmin]);

  const fetchAllPlacementResults = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/all-placement-results`);
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
    navigate("/");
  };

  const validatePlacementForm = () => {
    const newErrors = {};
    const fields = [
      { name: 'codingAssessment', label: 'Coding Assessment', val: codingAssessment },
      { name: 'problemsSolved', label: 'Problems Solved', val: problemsSolved },
      { name: 'mockAptitude', label: 'Mock Aptitude', val: mockAptitude },
      { name: 'logicalScore', label: 'Logical Score', val: logicalScore },
      { name: 'mockInterview', label: 'Mock Interview', val: mockInterview },
      { name: 'gdScore', label: 'GD Score', val: gdScore },
      { name: 'sessionParticipation', label: 'Session Participation', val: sessionParticipation },
      { name: 'workshopAttendance', label: 'Workshop Attendance', val: workshopAttendance }
    ];

    fields.forEach(f => {
      if (f.val === "" || Number(f.val) < 0 || Number(f.val) > 100) {
        newErrors[f.name] = `${f.label} must be between 0 and 100`;
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setGeneralError("Please correct the errors before calculating.");
    } else {
      setGeneralError("");
    }
    return Object.keys(newErrors).length === 0;
  };

  const isPlacementFormValid = () => {
    if (Object.keys(errors).length > 0) return false;
    const values = [codingAssessment, problemsSolved, mockAptitude, logicalScore, mockInterview, gdScore, sessionParticipation, workshopAttendance];
    return values.every(v => v !== "" && Number(v) >= 0 && Number(v) <= 100);
  };

  const handleFieldChange = (setter, fieldName, value) => {
    setter(value);

    // Real-time validation
    setErrors(prev => {
      const next = { ...prev };
      if (value === "" || Number(value) < 0 || Number(value) > 100) {
        next[fieldName] = "Value must be between 0 and 100";
      } else {
        delete next[fieldName];
      }

      if (Object.keys(next).length === 0) {
        setGeneralError("");
      }
      return next;
    });
  };

  const handleCalculate = async () => {
    if (!validatePlacementForm()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API}/calculate`, {
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
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (overall) => {
    if (overall >= 80) return "#10b981";
    if (overall >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const getStatusText = (overall) => {
    if (overall >= 80) return "Ready";
    if (overall >= 60) return "Moderately Ready";
    return "Not Ready";
  };

  if (profileCheckLoading && user?.role !== "admin") {
    return <div style={{ background: theme.bg, minHeight: "100vh" }}></div>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        display: "flex",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: theme.mainText
      }}
    >
      {/* ADMIN VIEW */}
      {isAdmin ? (
        <>
          <Sidebar
            navItems={getDashboardNav()}
            showLogout={true}
            onLogout={handleLogout}
            userName={user?.name || "Admin"}
          />

          <main style={{ marginLeft: "280px", flex: 1, padding: "40px 20px", overflowY: "auto" }}>
            <h1 style={{ color: theme.mainText, fontSize: "36px", marginBottom: "30px", fontWeight: "bold" }}>
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
                              {sortedAttempts.map((attempt, idx) => {
                                return (
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
            )}
          </main>
        </>
      ) : (
        /* STUDENT VIEW */
        <>
          <Sidebar
            navItems={getDashboardNav()}
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
                color: theme.mainText,
                fontSize: "42px",
                fontWeight: "700",
                marginBottom: "50px",
                textAlign: "center",
                textShadow: theme.isDarkMode ? "2px 2px 8px rgba(0,0,0,0.4)" : "none"
              }}
            >
              Placement Readiness Assessment
            </h1>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "30px",
                maxWidth: "1200px"
              }}
            >
              {[
                {
                  title: "Coding Skills",
                  inputs: [
                    { value: codingAssessment, setter: setCodingAssessment, name: "codingAssessment", placeholder: "Coding Assessment Score (0-100)" },
                    { value: problemsSolved, setter: setProblemsSolved, name: "problemsSolved", placeholder: "Problems Solved % (0-100)" }
                  ]
                },
                {
                  title: "Aptitude Skills",
                  inputs: [
                    { value: mockAptitude, setter: setMockAptitude, name: "mockAptitude", placeholder: "Mock Aptitude Score (0-100)" },
                    { value: logicalScore, setter: setLogicalScore, name: "logicalScore", placeholder: "Logical & Quant Score (0-100)" }
                  ]
                },
                {
                  title: "Communication Skills",
                  inputs: [
                    { value: mockInterview, setter: setMockInterview, name: "mockInterview", placeholder: "Mock Interview Score (0-100)" },
                    { value: gdScore, setter: setGdScore, name: "gdScore", placeholder: "GD Score (0-100)" }
                  ]
                },
                {
                  title: "Participation",
                  inputs: [
                    { value: sessionParticipation, setter: setSessionParticipation, name: "sessionParticipation", placeholder: "Session Participation % (0-100)" },
                    { value: workshopAttendance, setter: setWorkshopAttendance, name: "workshopAttendance", placeholder: "Workshop Attendance % (0-100)" }
                  ]
                }
              ].map((section, index) => (
                <div
                  key={index}
                  style={{
                    background: theme.cardBg,
                    backdropFilter: "blur(14px)",
                    padding: "30px",
                    borderRadius: "25px",
                    width: "350px",
                    color: theme.mainText,
                    boxShadow: theme.isDarkMode ? "0 12px 30px rgba(0,0,0,0.5)" : "0 4px 15px rgba(0,0,0,0.05)",
                    border: theme.cardBorder !== "none" ? theme.cardBorder : "1px solid rgba(255,255,255,0.25)"
                  }}
                >
                  <h3
                    style={{
                      fontSize: "22px",
                      marginBottom: "20px",
                      fontWeight: "700",
                      textShadow: theme.isDarkMode ? "1px 1px 5px rgba(0,0,0,0.3)" : "none"
                    }}
                  >
                    {section.title}
                  </h3>

                  {section.inputs.map((input, i) => (
                    <div key={i} style={{ marginBottom: "15px" }}>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder={input.placeholder}
                        value={input.value}
                        onChange={(e) => handleFieldChange(input.setter, input.name, e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "10px",
                          border: errors[input.name] ? "2px solid #ef4444" : "1px solid #cbd5e1",
                          fontSize: "15px",
                          background: "#FFFFFF",
                          color: "#000000",
                          textAlign: "center",
                          outline: "none",
                          fontWeight: "500"
                        }}
                      />
                      {errors[input.name] && (
                        <div style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px", fontWeight: "600" }}>
                          {errors[input.name]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {generalError && (
              <div style={{ color: "#ef4444", marginTop: "30px", fontWeight: "600", background: "rgba(239, 68, 68, 0.1)", padding: "10px 20px", borderRadius: "10px" }}>
                {generalError}
              </div>
            )}

            <button
              onClick={handleCalculate}
              disabled={loading || !isPlacementFormValid()}
              style={{
                padding: "16px 50px",
                marginTop: "40px",
                fontSize: "18px",
                fontWeight: "700",
                borderRadius: "30px",
                border: "none",
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "#FFFFFF",
                cursor: loading || !isPlacementFormValid() ? "not-allowed" : "pointer",
                opacity: loading || !isPlacementFormValid() ? 0.6 : 1,
                boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                if (!loading && isPlacementFormValid()) e.target.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
            >
              {loading ? "Calculating..." : "Calculate Placement Readiness"}
            </button>
          </main>
        </>
      )}
    </div>
  );
}

export default PlacementReadiness;
