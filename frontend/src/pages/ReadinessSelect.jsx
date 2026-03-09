import React, { useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useUser } from "../context/UserContext";

function ReadinessSelect() {
  const navigate = useNavigate();
  const { studentProfile, user, logout } = useUser();

  useEffect(() => {
    // Check if student profile exists
    if (user && !studentProfile) {
      // Redirect to student profile page if not completed
      navigate("/student-profile");
    }
  }, [studentProfile, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const assessmentCards = [
    {
      id: 1,
      title: "📚 Exam Readiness",
      description: "Evaluate your academic preparation, subject knowledge, revision consistency, and confidence before exams.",
      color: "#3b82f6",
      path: "/exam-readiness",
      gradient: "linear-gradient(135deg, #3b82f6, #1e40af)"
    },
    {
      id: 2,
      title: "💼 Placement Readiness",
      description: "Assess your coding skills, aptitude, communication abilities, and participation to measure placement readiness.",
      color: "#10b981",
      path: "/placement-readiness",
      gradient: "linear-gradient(135deg, #10b981, #065f46)"
    }
  ];

  const navItems = [
    { label: "Home", path: "/", icon: "🏠" },
    { label: "My Results", path: "/my-results", icon: "📊" },
    { label: "Profile", path: "/student-profile", icon: "👤" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b, #334155)",
        display: "flex",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      <Sidebar 
        navItems={navItems} 
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
          padding: "40px 20px",
        }}
      >
        {/* Main Heading */}
        <h1
          style={{
            color: "white",
            fontSize: "48px",
            fontWeight: "800",
            marginBottom: "15px",
            textAlign: "center",
            letterSpacing: "-0.5px"
          }}
        >
          Choose Your Assessment
        </h1>

        {/* Subtitle */}
        <p
          style={{
            color: "#cbd5e1",
            fontSize: "18px",
            marginBottom: "60px",
            textAlign: "center",
            maxWidth: "600px",
            lineHeight: "1.6"
          }}
        >
          Select the assessment type that best fits your current needs
        </p>

      {/* Cards Container */}
      <div
        style={{
          display: "flex",
          gap: "40px",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "1000px"
        }}
      >
        {assessmentCards.map((card, index) => (
          <div
            key={card.id}
            style={{
              animation: `slideIn 0.6s ease-out ${index * 0.2}s both`,
              "@keyframes slideIn": {
                from: {
                  opacity: 0,
                  transform: "translateY(30px)"
                },
                to: {
                  opacity: 1,
                  transform: "translateY(0)"
                }
              }
            }}
          >
            <style>{`
              @keyframes slideIn {
                from {
                  opacity: 0;
                  transform: translateY(30px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }

              .assessment-card:hover {
                transform: translateY(-10px) scale(1.02);
                box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3);
              }

              .assessment-card {
                transition: all 0.3s ease;
              }

              .start-button:hover {
                transform: scale(1.05);
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
              }

              .start-button {
                transition: all 0.3s ease;
              }
            `}</style>
            <Card
              className="assessment-card shadow-lg"
              style={{
                width: "380px",
                borderRadius: "16px",
                border: "none",
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                padding: "35px",
                textAlign: "center",
                color: "#fff",
                cursor: "pointer",
                borderLeft: `4px solid ${card.color}`,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
              }}
              onClick={() => navigate(card.path)}
            >
              {/* Icon Container */}
              <div
                style={{
                  fontSize: "60px",
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "center",
                  animation: "float 3s ease-in-out infinite"
                }}
              >
                {card.title.split(" ")[0]}
              </div>

              {/* Title */}
              <h2
                style={{
                  fontSize: "26px",
                  fontWeight: "700",
                  marginBottom: "15px",
                  background: `linear-gradient(135deg, #fff, #cbd5e1)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                {card.title.substring(2)}
              </h2>

              {/* Description */}
              <p
                style={{
                  fontSize: "16px",
                  lineHeight: "1.8",
                  color: "#cbd5e1",
                  marginBottom: "30px",
                  minHeight: "80px"
                }}
              >
                {card.description}
              </p>

              {/* Stats or Highlights */}
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  marginBottom: "30px",
                  justifyContent: "center"
                }}
              >
                <div
                  style={{
                    background: "rgba(59, 130, 246, 0.1)",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "#3b82f6"
                  }}
                >
                  📊 5-10 mins
                </div>
                <div
                  style={{
                    background: "rgba(16, 185, 129, 0.1)",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "#10b981"
                  }}
                >
                  ✓ Instant Results
                </div>
              </div>

              {/* Start Button */}
              <Button
                className="start-button w-100"
                style={{
                  background: card.gradient,
                  border: "none",
                  padding: "12px 24px",
                  fontSize: "16px",
                  fontWeight: "600",
                  borderRadius: "10px",
                  color: "#fff",
                  cursor: "pointer",
                  letterSpacing: "0.5px"
                }}
              >
                Start Assessment →
              </Button>
            </Card>
          </div>
        ))}
      </div>

      {/* Floating animation keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .assessment-card:hover .start-button {
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
        }
      `}</style>

      {/* Back Button */}
      <div style={{ marginTop: "50px" }}>
        <Button
          variant="outline-light"
          size="lg"
          onClick={() => navigate("/")}
          style={{
            borderColor: "#cbd5e1",
            color: "#cbd5e1",
            fontSize: "16px",
            padding: "10px 30px",
            borderRadius: "8px"
          }}
        >
          ← Back to Home
        </Button>
      </div>
      </main>
    </div>
  );
}

export default ReadinessSelect;
