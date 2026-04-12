import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../context/ThemeContext";
import { useUser } from "../context/UserContext";
import { getDashboardNav } from "../utils/navConfig";

const API = process.env.REACT_APP_API_URL || "https://readiness-monitoring-system.onrender.com";

function ProgressAnalytics() {
  const { theme, isDarkMode } = useTheme();
  const { user, studentProfile, logout } = useUser();
  const navigate = useNavigate();
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

  const [examData, setExamData] = useState([]);
  const [placementData, setPlacementData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.userEmail) {
      fetchProgressData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchProgressData = async () => {
    try {
      const email = user.userEmail;
      const [examRes, placementRes] = await Promise.all([
        axios.get(`${API}/my-exam-attempts/${email}`),
        axios.get(`${API}/my-placement-attempts/${email}`)
      ]);

      // Normalize data and sort by date (oldest to newest for charts)
      const sortOldest = (arr) => {
        if (!Array.isArray(arr)) return [];
        return [...arr].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      };

      setExamData(sortOldest(examRes.data));
      setPlacementData(sortOldest(placementRes.data));
    } catch (error) {
      console.error("Error fetching progress data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const renderTrendChart = (data, color, label) => {
    if (!data || data.length === 0) {
      return (
        <div style={{ height: "240px", display: "flex", alignItems: "center", justifyContent: "center", border: `1px dashed ${theme.tableBorder}`, borderRadius: "8px" }}>
          <p style={{ color: theme.subText }}>Not enough data to show trend</p>
        </div>
      );
    }

    const width = 800;
    const height = 280;
    const padding = { top: 20, right: 40, bottom: 60, left: 50 };

    const displayData = data;

    const points = displayData.map((d, i) => {
      const x = padding.left + (i * (width - padding.left - padding.right)) / Math.max(1, displayData.length - 1);
      const y = height - padding.bottom - (d.overall * (height - padding.top - padding.bottom)) / 100;
      return `${x},${y}`;
    }).join(" ");

    return (
      <div style={{ position: "relative", marginBottom: "20px", overflowX: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
          <h4 style={{ fontSize: "16px", color: theme.mainText, fontWeight: "600" }}>{label} Performance Over Time</h4>
          <span style={{ fontSize: "14px", color: color, fontWeight: "bold" }}>Success Rate (%)</span>
        </div>
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible", minWidth: "600px" }}>
          {/* Y-Axis Grid & Labels */}
          {[0, 25, 50, 75, 100].map(val => {
            const y = height - padding.bottom - (val * (height - padding.top - padding.bottom)) / 100;
            return (
              <g key={val}>
                <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke={isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeWidth="1" />
                <text x={padding.left - 10} y={y + 4} fontSize="11" fill={theme.subText} textAnchor="end">{val}%</text>
              </g>
            );
          })}

          {/* X-Axis Labels (Dates) */}
          {displayData.map((d, i) => {
            const x = padding.left + (i * (width - padding.left - padding.right)) / Math.max(1, displayData.length - 1);
            const dateStr = new Date(d.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

            // Only show labels for every Nth point if there are many to avoid overlap
            const step = Math.ceil(displayData.length / 8);
            if (i % step !== 0 && i !== displayData.length - 1) return null;

            return (
              <text
                key={i}
                x={x}
                y={height - padding.bottom + 25}
                fontSize="10"
                fill={theme.subText}
                textAnchor="middle"
                transform={`rotate(0, ${x}, ${height - padding.bottom + 25})`}
              >
                {dateStr}
              </text>
            );
          })}

          {/* X-Axis Line */}
          <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke={theme.tableBorder} strokeWidth="1" />

          {/* Connecting Path */}
          {displayData.length > 1 && (
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
              style={{ filter: `drop-shadow(0px 0px 6px ${color}66)` }}
            />
          )}

          {/* Data points */}
          {displayData.map((d, i) => {
            const x = padding.left + (i * (width - padding.left - padding.right)) / Math.max(1, displayData.length - 1);
            const y = height - padding.bottom - (d.overall * (height - padding.top - padding.bottom)) / 100;
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="5" fill={color} style={{ cursor: "pointer" }}>
                  <title>{`${d.overall}% - ${new Date(d.createdAt).toLocaleDateString()}`}</title>
                </circle>
                {/* Tooltip background on hover can be complex, sticking to native title for now */}
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  const getStats = (data) => {
    if (!data || data.length === 0) return { total: 0, high: 0, latest: 0, delta: 0 };
    const latest = data[data.length - 1].overall;
    const previous = data.length > 1 ? data[data.length - 2].overall : latest;
    return {
      total: data.length,
      high: Math.max(...data.map(d => d.overall)),
      latest: latest,
      delta: latest - previous
    };
  };

  const examStats = getStats(examData);
  const placementStats = getStats(placementData);

  const StatCard = ({ title, value, subValue, color, icon }) => (
    <Card style={{
      background: theme.cardBg,
      border: theme.cardBorder,
      borderRadius: "12px",
      padding: "20px",
      color: theme.mainText,
      boxShadow: theme.cardShadow
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ margin: 0, fontSize: "14px", color: theme.subText }}>{title}</p>
          <h3 style={{ margin: "5px 0", fontSize: "28px", fontWeight: "bold" }}>{value}</h3>
          <p style={{ margin: 0, fontSize: "12px", color: subValue >= 0 ? "#10b981" : "#ef4444" }}>
            {subValue >= 0 ? "↑" : "↓"} {Math.abs(subValue)}% from last attempt
          </p>
        </div>
        <div style={{ fontSize: "30px", opacity: 0.2 }}>{icon}</div>
      </div>
    </Card>
  );

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
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundAttachment: "fixed"
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
          padding: "40px 20px",
          height: "100vh",
          overflowY: "auto"
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "40px", textAlign: "center" }}>
            <h1 style={{ color: theme.mainText, fontSize: "42px", fontWeight: "800", margin: 0, letterSpacing: "-1px" }}>
              Progress Analytics
            </h1>
            <div style={{ width: "60px", height: "4px", background: "#3b82f6", margin: "15px auto", borderRadius: "2px" }}></div>
          </div>

          {loading ? (
            <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p>Loading analytics...</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "50px" }}>

              {/* SUMMARY CARDS ROW */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "25px" }}>
                <StatCard
                  title="Latest Exam Score"
                  value={`${examStats.latest}%`}
                  subValue={examStats.delta}
                  icon="📝"
                />
                <StatCard
                  title="Latest Placement Score"
                  value={`${placementStats.latest}%`}
                  subValue={placementStats.delta}
                  icon="💼"
                />
                <StatCard
                  title="Total Attempts"
                  value={examStats.total + placementStats.total}
                  subValue={0}
                  icon="🔢"
                />
              </div>

              <hr style={{ border: "0", borderTop: "1px solid rgba(255,255,255,0.1)", margin: "10px 0" }} />

              {/* EXAM READINESS SECTION */}
              <section>
                <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "25px", color: "#3b82f6" }}>
                  Exam Readiness Progress
                </h2>
                <div style={{ background: theme.cardBg, padding: "30px", borderRadius: "20px", border: theme.cardBorder, boxShadow: theme.cardShadow }}>
                  {renderTrendChart(examData, "#3b82f6", "Exam")}
                </div>
              </section>

              <hr style={{ border: "0", borderTop: "1px solid rgba(255,255,255,0.1)", margin: "10px 0" }} />

              {/* PLACEMENT READINESS SECTION */}
              <section style={{ marginBottom: "40px" }}>
                <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "25px", color: "#10b981" }}>
                  Placement Readiness Progress
                </h2>
                <div style={{ background: theme.cardBg, padding: "30px", borderRadius: "20px", border: theme.cardBorder, boxShadow: theme.cardShadow }}>
                  {renderTrendChart(placementData, "#10b981", "Placement")}
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ProgressAnalytics;
