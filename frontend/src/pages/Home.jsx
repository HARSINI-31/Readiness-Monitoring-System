// src/pages/Home.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { useUser } from "../context/UserContext";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useUser();


  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column p-0">
      {/* Top Navigation Bar */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          backgroundColor: "#1e293b",
          borderBottom: "1px solid rgba(203, 213, 225, 0.2)",
          zIndex: 100,
          padding: "0",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Adjusted maxWidth to 100% and reduced horizontal margins/paddings to push items to the edges */}
        <div style={{ maxWidth: "100%", margin: "0 auto", padding: "12px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            {/* Left side: Logo / Project Name */}
            <div 
              style={{ display: "flex", alignItems: "center", cursor: "pointer", gap: "10px", paddingLeft: "10px" }}
              onClick={() => window.scrollTo(0, 0)}
            >
              <Logo size="small" />
              <span style={{ fontSize: "20px", fontWeight: "bold", color: "#ffffff", letterSpacing: "0.5px" }}>
                Readiness Pro
              </span>
            </div>

            {/* Right side: Navigation Links - Increased gap for more spacing between items */}
            <div style={{ display: "flex", alignItems: "center", gap: "45px", flexWrap: "wrap", paddingRight: "10px" }}>
              <button
                onClick={() => scrollToSection("about-section")}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "#cbd5e1",
                  fontSize: "15px",
                  fontWeight: "500",
                  cursor: "pointer",
                  padding: "8px 4px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#ffffff")}
                onMouseLeave={(e) => (e.target.style.color = "#cbd5e1")}
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("contact-section")}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "#cbd5e1",
                  fontSize: "15px",
                  fontWeight: "500",
                  cursor: "pointer",
                  padding: "8px 4px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#ffffff")}
                onMouseLeave={(e) => (e.target.style.color = "#cbd5e1")}
              >
                Contact
              </button>
              <button
                onClick={() => navigate("/login")}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "#cbd5e1",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                  padding: "8px 4px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#ffffff")}
                onMouseLeave={(e) => (e.target.style.color = "#cbd5e1")}
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                style={{
                  backgroundColor: "#3b82f6",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                  padding: "8px 24px",
                  borderRadius: "6px",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 4px rgba(59, 130, 246, 0.4)",
                  marginLeft: "15px"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#2563eb";
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.boxShadow = "0 4px 8px rgba(59, 130, 246, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#3b82f6";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 2px 4px rgba(59, 130, 246, 0.4)";
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Heading Section */}
      <div
        className="text-center py-5 text-white"
        style={{
          background: "linear-gradient(135deg, #0f172a, #1e293b, #334155)",
        }}
      >
        <h1 className="fw-bold mt-4">
          Track Your Exam and Placement Readiness
        </h1>

        <p className="lead mt-3 mx-auto mb-5" style={{ maxWidth: "700px" }}>
          This platform helps students understand their exam and placement readiness
          based on performance and preparation metrics.
        </p>
      </div>

      {/* Features Section */}
      <div className="container py-5">
        <h2 className="text-center fw-bold mb-5 text-primary">
          What You Can Do Here
        </h2>

        <div className="row text-center">

          <div className="col-md-3 mb-4">
            <div className="card shadow border-0 p-4 h-100 feature-card">
              <i className="bi bi-bar-chart-fill fs-1 text-primary mb-3"></i>
              <h5 className="fw-bold">Assess Exam Readiness</h5>
            </div>
          </div>

          <div className="col-md-3 mb-4">
            <div className="card shadow border-0 p-4 h-100 feature-card">
              <i className="bi bi-briefcase-fill fs-1 text-success mb-3"></i>
              <h5 className="fw-bold">Evaluate Placement Readiness</h5>
            </div>
          </div>

          <div className="col-md-3 mb-4">
            <div className="card shadow border-0 p-4 h-100 feature-card">
              <i className="bi bi-graph-up-arrow fs-1 text-warning mb-3"></i>
              <h5 className="fw-bold">View Readiness Results</h5>
            </div>
          </div>

          <div className="col-md-3 mb-4">
            <div className="card shadow border-0 p-4 h-100 feature-card">
              <i className="bi bi-rocket-takeoff-fill fs-1 text-danger mb-3"></i>
              <h5 className="fw-bold">Track Progress</h5>
            </div>
          </div>

        </div>
      </div>

      {/* Who Is This For Section */}
      <div
        className="py-5 text-white"
        style={{
          background: "linear-gradient(135deg, #1e3c72, #6a11cb)",
        }}
      >
        <div className="container text-center">
          <h2 className="fw-bold mb-3">
            Who Is This For
          </h2>

          <p className="fs-5 mx-auto" style={{ maxWidth: "700px" }}>
            This platform is designed for students to self-evaluate their academic
            and placement readiness.
          </p>
        </div>
      </div>

      {/* About Section */}
      <div
        id="about-section"
        className="py-5"
        style={{
          background: "#f8fafc",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <div className="container">
          <h2 className="fw-bold mb-4" style={{ color: "#0f172a", fontSize: "2.5rem" }}>
            About the Readiness Monitoring System
          </h2>

          <div style={{ color: "#475569", lineHeight: "1.8", fontSize: "16px" }}>
            <p className="mb-3">
              The Readiness Monitoring System is a web-based application designed to help students evaluate and track their preparation levels for both academic examinations and campus placements. The system provides structured readiness assessments that allow students to measure their performance and monitor their improvement over time.
            </p>

            <p className="mb-3">
              This platform enables students to attempt readiness evaluations multiple times and maintain a history of their scores. By analyzing their results, students can identify strengths and areas that require improvement, helping them prepare more effectively.
            </p>

            <p className="mb-4">
              The system also includes an administrative dashboard that allows authorized personnel to monitor overall student performance and readiness levels.
            </p>

            <div
              style={{
                backgroundColor: "#e0f2fe",
                border: "2px solid #0369a1",
                borderRadius: "8px",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              <h5 style={{ color: "#0369a1", fontWeight: "700", marginBottom: "15px" }}>
                Key Objectives:
              </h5>
              <ul style={{ color: "#0c4a6e", marginBottom: "0" }}>
                <li className="mb-2">To assess Exam Readiness</li>
                <li className="mb-2">To assess Placement Readiness</li>
                <li className="mb-2">To track student progress over multiple attempts</li>
                <li className="mb-2">To provide performance insights</li>
                <li>To support better preparation strategies</li>
              </ul>
            </div>

            <p className="mb-0">
              This application aims to promote continuous improvement and help students achieve academic and career success.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div
        id="contact-section"
        className="py-5"
        style={{
          background: "linear-gradient(135deg, #1e293b, #0f172a)",
          color: "#ffffff",
        }}
      >
        <div className="container">
          <h2 className="fw-bold mb-4" style={{ fontSize: "2.5rem" }}>
            Contact Us
          </h2>

          <p className="fs-5 mb-4">
            If you have any questions, suggestions, or issues regarding the Readiness Monitoring System, please feel free to contact us. We are here to help you improve your academic and placement readiness.
          </p>

          <div className="row">
            <div className="col-md-6 mb-4">
              <div
                style={{
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  border: "2px solid #3b82f6",
                  borderRadius: "8px",
                  padding: "20px",
                  height: "100%",
                }}
              >
                <h5 style={{ color: "#60a5fa", fontWeight: "700", marginBottom: "12px" }}>
                  📧 Email Support
                </h5>
                <p style={{ color: "#cbd5e1", marginBottom: "0" }}>
                  <a
                    href="mailto:support@readinesssystem.com"
                    style={{
                      color: "#60a5fa",
                      textDecoration: "none",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#93c5fd")}
                    onMouseLeave={(e) => (e.target.style.color = "#60a5fa")}
                  >
                    support@readinesssystem.com
                  </a>
                </p>
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <div
                style={{
                  backgroundColor: "rgba(34, 197, 94, 0.1)",
                  border: "2px solid #22c55e",
                  borderRadius: "8px",
                  padding: "20px",
                  height: "100%",
                }}
              >
                <h5 style={{ color: "#86efac", fontWeight: "700", marginBottom: "12px" }}>
                  📞 Phone
                </h5>
                <p style={{ color: "#cbd5e1", marginBottom: "0" }}>
                  <a
                    href="tel:+919876543210"
                    style={{
                      color: "#86efac",
                      textDecoration: "none",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#bbf7d0")}
                    onMouseLeave={(e) => (e.target.style.color = "#86efac")}
                  >
                    +91 98765 43210
                  </a>
                </p>
              </div>
            </div>

            <div className="col-md-12 mb-4">
              <div
                style={{
                  backgroundColor: "rgba(168, 85, 247, 0.1)",
                  border: "2px solid #a855f7",
                  borderRadius: "8px",
                  padding: "20px",
                }}
              >
                <h5 style={{ color: "#d8b4fe", fontWeight: "700", marginBottom: "12px" }}>
                  🏫 Institution
                </h5>
                <p style={{ color: "#cbd5e1", marginBottom: "8px" }}>
                  Department of Electronics and Communication Engineering, BIT
                </p>
              </div>
            </div>

            <div className="col-md-12 mb-4">
              <div
                style={{
                  backgroundColor: "rgba(251, 146, 60, 0.1)",
                  border: "2px solid #fb923c",
                  borderRadius: "8px",
                  padding: "20px",
                }}
              >
                <h5 style={{ color: "#fdba74", fontWeight: "700", marginBottom: "12px" }}>
                  📍 Address
                </h5>
                <p style={{ color: "#cbd5e1", marginBottom: "0" }}>
                  BIT, Sathyamangalam, Erode
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              backgroundColor: "rgba(203, 213, 225, 0.1)",
              borderRadius: "8px",
              textAlign: "center",
              color: "#cbd5e1",
            }}
          >
            <p style={{ marginBottom: "0" }}>
              We typically respond within 24–48 hours.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        © 2026 Readiness Monitoring System | All Rights Reserved
      </footer>

    </div>
  );
};

export default Home;
