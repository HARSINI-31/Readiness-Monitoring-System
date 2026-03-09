import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Sidebar from "../components/Sidebar";
import { useUser } from "../context/UserContext";


function ExamResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const data = location.state;

  const handleLogout = () => {
    logout();
    navigate("/login");
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
    internalAssignments,
    assignmentCompletion,
    attendance,
    unitTestMarks,
    midSemExam,
    overall,
  } = data;


  const parameters = [
    { name: "Internal", value: internalAssignments, color: "#4e73df" },
    { name: "Completion", value: assignmentCompletion, color: "#1cc88a" },
    { name: "Attendance", value: attendance, color: "#36b9cc" },
    { name: "Unit Test", value: unitTestMarks, color: "#f6c23e" },
    { name: "Mid-Sem", value: midSemExam, color: "#e74a3b" },
  ];


  let feedback = "";
  let status = "";
  let statusColor = "";
  
  if (overall >= 85) {
    feedback = "Excellent preparation! Keep it up!";
    status = "Ready";
    statusColor = "#10b981";
  } else if (overall >= 70) {
    feedback = "Good job! Focus on weak areas to improve.";
    status = "Moderately Ready";
    statusColor = "#f59e0b";
  } else if (overall >= 50) {
    feedback = "Moderate performance. More consistency required.";
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
        background: "linear-gradient(135deg, #0f172a, #1e293b, #334155)",
        color: "#ffffff",
        display: "flex",
      }}
    >
      <Sidebar
        navItems={[
          { label: "Home", path: "/", icon: "🏠" },
          { label: "Exam Readiness", path: "/exam-readiness", icon: "📚" },
          { label: "Placement Readiness", path: "/placement-readiness", icon: "💼" },
          { label: "My Results", path: "/my-results", icon: "📊" },
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


