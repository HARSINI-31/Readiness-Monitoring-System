import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Sidebar from "../components/Sidebar";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";
import { getDashboardNav } from "../utils/navConfig";


function ExamResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const { theme } = useTheme();
  const data = location.state;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!data) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>No data found. Please calculate readiness first.</h2>
        <button onClick={() => navigate("/exam-readiness")}>
          Go Back
        </button>
      </div>
    );
  }

  const {
    department,
    subjects,
    attendance,
    studyHours,
    avgInternalMarks,
    avgAssignmentCompletion,
    avgAttendance,
    avgStudyHours,
    overall,
  } = data;


  const parameters = [
    { name: "Avg Internal", value: avgInternalMarks || 0, color: "#4e73df" },
    { name: "Avg Assignment", value: avgAssignmentCompletion || 0, color: "#1cc88a" },
    { name: "Attendance", value: avgAttendance || 0, color: "#36b9cc" },
    { name: "Study Hours", value: (avgStudyHours / 10) * 100 || 0, color: "#f6c23e" },
  ];


  let feedback = "";
  let status = "";
  let statusColor = "";
  
  if (overall >= 80) {
    feedback = "Excellent preparation! Keep it up!";
    status = "Ready";
    statusColor = "#10b981";
  } else if (overall >= 60) {
    feedback = "Good job! Focus on weak areas to improve.";
    status = "Moderately Ready";
    statusColor = "#f59e0b";
  } else {
    feedback = "You need to work harder on your preparation.";
    status = "Not Ready";
    statusColor = "#ef4444";
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
          alignItems: "center",
          padding: "40px 20px",
        }}
      >
        <h1 style={{ fontSize: "36px", marginBottom: "30px" }}>
          📝 Exam Readiness Report
        </h1>

        {/* Status Badge */}
        <div
          style={{
            background: statusColor,
            color: "#fff",
            padding: "10px 24px",
            borderRadius: "25px",
            fontSize: "18px",
            fontWeight: "700",
            marginBottom: "30px",
            textTransform: "uppercase",
            letterSpacing: "1px"
          }}
        >
          {status}
        </div>


        {/* ===== Circular Overall Score ===== */}
        <div style={{ width: "170px", marginBottom: "50px" }}>
          <CircularProgressbar
            value={overall}
            text={`${overall}%`}
            styles={buildStyles({
              textColor: "#fff",
              pathColor:
                overall >= 85
                  ? "#22c55e"
                  : overall >= 70
                  ? "#3b82f6"
                  : overall >= 50
                  ? "#f59e0b"
                  : "#ef4444",
              trailColor: "#334155",
            })}
          />
        </div>


        {/* ===== Vertical Bar Chart Section ===== */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: "40px",
            height: "300px",
            width: "100%",
            maxWidth: "800px",
            marginBottom: "40px",
          }}
        >
          {parameters.map((param, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                height: "100%",
              }}
            >
              <div style={{ marginBottom: "10px" }}>
                {param.value}%
              </div>


              <div
                style={{
                  width: "50px",
                  height: `${param.value * 2}px`,
                  background: param.color,
                  borderRadius: "8px 8px 0 0",
                  transition: "height 1s ease-in-out",
                }}
              />


              <div
                style={{
                  marginTop: "10px",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                {param.name}
              </div>
            </div>
          ))}
        </div>


        {/* ===== Feedback ===== */}
        <div
          style={{
            fontSize: "20px",
            fontWeight: "500",
            marginBottom: "40px",
            textAlign: "center",
          }}
        >
          {feedback}
        </div>

        {/* ===== Subject-wise Breakdown ===== */}
        <div
          style={{
            width: "100%",
            maxWidth: "1000px",
            marginBottom: "40px",
            background: theme.cardBg,
            borderRadius: "15px",
            padding: "20px",
            border: theme.cardBorder !== "none" ? theme.cardBorder : "1px solid rgba(203, 213, 225, 0.2)",
          }}
        >
          <h3 style={{ color: theme.mainText, marginBottom: "20px", textAlign: "center" }}>
            📚 Subject-wise Performance Breakdown
          </h3>
          <div style={{ color: theme.subText, marginBottom: "20px", textAlign: "center", fontSize: "14px" }}>
            Department: <span style={{ color: "#3b82f6", fontWeight: "bold" }}>{department}</span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                color: theme.mainText,
                borderCollapse: "collapse",
                fontSize: "14px",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "2px solid #3b82f6", background: "rgba(59, 130, 246, 0.1)" }}>
                  <th style={{ padding: "12px", textAlign: "left", color: "#3b82f6" }}>Subject Code</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#3b82f6" }}>Subject Name</th>
                  <th style={{ padding: "12px", textAlign: "center", color: "#3b82f6" }}>Internal</th>
                  <th style={{ padding: "12px", textAlign: "center", color: "#3b82f6" }}>Assignment</th>
                  <th style={{ padding: "12px", textAlign: "center", color: "#3b82f6" }}>Attendance</th>
                  <th style={{ padding: "12px", textAlign: "center", color: "#3b82f6" }}>Study Hours</th>
                </tr>
              </thead>
              <tbody>
                {subjects?.map((subject, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid rgba(203, 213, 225, 0.2)" }}>
                    <td style={{ padding: "12px", fontWeight: "bold", color: "#3b82f6" }}>
                      {subject.code}
                    </td>
                    <td style={{ padding: "12px", color: theme.mainText }}>
                      {subject.name}
                    </td>
                    <td style={{ padding: "12px", textAlign: "center", color: theme.mainText }}>
                      {subject.internalMarks}%
                    </td>
                    <td style={{ padding: "12px", textAlign: "center", color: theme.mainText }}>
                      {subject.assignmentCompletion}%
                    </td>
                    <td style={{ padding: "12px", textAlign: "center", color: theme.mainText }}>
                      {subject.attendance}%
                    </td>
                    <td style={{ padding: "12px", textAlign: "center", color: theme.mainText }}>
                      {subject.studyHours}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: "20px", padding: "15px", background: "rgba(59, 130, 246, 0.1)", borderRadius: "10px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", fontSize: "14px" }}>
              <div>
                <strong style={{ color: theme.mainText }}>Overall Attendance:</strong>{" "}
                <span style={{ color: "#3b82f6" }}>{attendance}%</span>
              </div>
              <div>
                <strong style={{ color: theme.mainText }}>Daily Study Hours:</strong>{" "}
                <span style={{ color: "#3b82f6" }}>{studyHours}/10</span>
              </div>
              <div>
                <strong style={{ color: theme.mainText }}>Average Internal Marks:</strong>{" "}
                <span style={{ color: "#3b82f6" }}>{avgInternalMarks}%</span>
              </div>
              <div>
                <strong style={{ color: theme.mainText }}>Average Assignment:</strong>{" "}
                <span style={{ color: "#3b82f6" }}>{avgAssignmentCompletion}%</span>
              </div>
              <div>
                <strong style={{ color: theme.mainText }}>Average Attendance:</strong>{" "}
                <span style={{ color: "#3b82f6" }}>{avgAttendance}%</span>
              </div>
              <div>
                <strong style={{ color: theme.mainText }}>Average Study Hours:</strong>{" "}
                <span style={{ color: "#3b82f6" }}>{avgStudyHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Recalculate Button ONLY ===== */}
        <button
          style={{
            padding: "12px 40px",
            fontSize: "18px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            background: "#3b82f6",
            color: "#fff",
            fontWeight: "600",
          }}
          onClick={() => navigate("/exam-readiness")}
        >
          Recalculate
        </button>
      </main>
    </div>
  );
}


export default ExamResult;


