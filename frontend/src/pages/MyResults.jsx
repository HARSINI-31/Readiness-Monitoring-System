import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useUser } from "../context/UserContext";

function MyResults() {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [attempts, setAttempts] = useState({ exam: [], placement: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.userEmail) {
      fetchAllAttempts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchAllAttempts = async () => {
    try {
      const [examRes, placementRes] = await Promise.all([
        axios.get(`http://localhost:5000/my-exam-attempts/${user?.userEmail}`),
        axios.get(`http://localhost:5000/my-placement-attempts/${user?.userEmail}`)
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
    navigate("/login");
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
          { label: "Home", path: "/", icon: "🏠" },
          { label: "Exam Readiness", path: "/exam-readiness", icon: "📚" },
          { label: "Placement Readiness", path: "/placement-readiness", icon: "💼" },
          { label: "Profile", path: "/student-profile", icon: "👤" },
        ]}
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
              <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px", color: "#60a5fa" }}>
                📝 Exam Readiness Attempts
              </h2>
              {sortAttempts(attempts.exam).length > 0 ? (
                <div style={{ overflowX: "auto", backgroundColor: "#0f172a", borderRadius: "12px", padding: "20px", border: "1px solid #334155" }}>
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
                        <th style={{ padding: "12px", textAlign: "left", color: "#60a5fa", fontWeight: "600" }}>
                          Internal
                        </th>
                        <th style={{ padding: "12px", textAlign: "left", color: "#60a5fa", fontWeight: "600" }}>
                          Completion %
                        </th>
                        <th style={{ padding: "12px", textAlign: "left", color: "#60a5fa", fontWeight: "600" }}>
                          Attendance %
                        </th>
                        <th style={{ padding: "12px", textAlign: "left", color: "#60a5fa", fontWeight: "600" }}>
                          Unit Test
                        </th>
                        <th style={{ padding: "12px", textAlign: "left", color: "#60a5fa", fontWeight: "600" }}>
                          Mid-Sem
                        </th>
                        <th style={{ padding: "12px", textAlign: "left", color: "#60a5fa", fontWeight: "600" }}>
                          Overall %
                        </th>
                        <th style={{ padding: "12px", textAlign: "left", color: "#60a5fa", fontWeight: "600" }}>
                          Status
                        </th>
                        <th style={{ padding: "12px", textAlign: "left", color: "#60a5fa", fontWeight: "600" }}>
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortAttempts(attempts.exam).map((attempt, idx) => (
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
              ) : (
                <Card
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "12px",
                    backdropFilter: "blur(10px)",
                    padding: "30px",
                    color: "#fff",
                    textAlign: "center",
                    border: "1px solid #334155",
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
              <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px", color: "#34d399" }}>
                💼 Placement Readiness Attempts
              </h2>
              {sortAttempts(attempts.placement).length > 0 ? (
                <div style={{ overflowX: "auto", backgroundColor: "#0f172a", borderRadius: "12px", padding: "20px", border: "1px solid #334155" }}>
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
                        <th style={{ padding: "12px", textAlign: "left", color: "#34d399", fontWeight: "600" }}>
                          Aptitude
                        </th>
                        <th style={{ padding: "12px", textAlign: "left", color: "#34d399", fontWeight: "600" }}>
                          Technical
                        </th>
                        <th style={{ padding: "12px", textAlign: "left", color: "#34d399", fontWeight: "600" }}>
                          Communication
                        </th>
                        <th style={{ padding: "12px", textAlign: "left", color: "#34d399", fontWeight: "600" }}>
                          Coding
                        </th>
                        <th style={{ padding: "12px", textAlign: "left", color: "#34d399", fontWeight: "600" }}>
                          Overall %
                        </th>
                        <th style={{ padding: "12px", textAlign: "left", color: "#34d399", fontWeight: "600" }}>
                          Status
                        </th>
                        <th style={{ padding: "12px", textAlign: "left", color: "#34d399", fontWeight: "600" }}>
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortAttempts(attempts.placement).map((attempt, idx) => (
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
              ) : (
                <Card
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "12px",
                    backdropFilter: "blur(10px)",
                    padding: "30px",
                    color: "#fff",
                    textAlign: "center",
                    border: "1px solid #334155",
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
