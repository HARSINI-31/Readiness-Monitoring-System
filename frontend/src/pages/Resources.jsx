import React from "react";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../context/ThemeContext";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { getDashboardNav } from "../utils/navConfig";

function Resources() {
  const { theme } = useTheme();
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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
      <style>
        {`
          .resource-link {
            color: #3B82F6;
            font-weight: 500;
            transition: all 0.2s ease;
            text-decoration: none;
            cursor: pointer;
          }
          .resource-link:hover {
            color: #60A5FA;
            text-decoration: underline;
          }
        `}
      </style>
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
          padding: "40px 20px",
        }}
      >
        <h1 style={{ color: theme.mainText, fontWeight: "800", marginBottom: "30px" }}>
          Resources
        </h1>
        
        {/* Coding Practice Section */}
        <div style={{ marginBottom: "50px" }}>
          <h2 style={{ color: theme.mainText, fontWeight: "600", marginBottom: "25px", fontSize: "24px" }}>
            Coding Practice
          </h2>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "20px" 
          }}>
            {/* LeetCode */}
            <div style={{ 
              background: theme.cardBg, 
              border: theme.cardBorder, 
              borderRadius: "12px", 
              padding: "25px", 
              transition: "all 0.3s ease",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-4px)";
              e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            }}
            onClick={() => window.open("https://leetcode.com", "_blank")}
            >
              <h3 style={{ color: theme.mainText, fontWeight: "600", marginBottom: "10px", fontSize: "20px" }}>
                LeetCode
              </h3>
              <p style={{ color: theme.subText, marginBottom: "20px", lineHeight: "1.5" }}>
                Practice coding problems with thousands of algorithmic challenges across different difficulty levels.
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span className="resource-link">Open Resource</span>
                <span style={{ color: "#3B82F6", fontSize: "18px" }}>↗</span>
              </div>
            </div>

            {/* HackerRank */}
            <div style={{ 
              background: theme.cardBg, 
              border: theme.cardBorder, 
              borderRadius: "12px", 
              padding: "25px", 
              transition: "all 0.3s ease",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-4px)";
              e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            }}
            onClick={() => window.open("https://www.hackerrank.com", "_blank")}
            >
              <h3 style={{ color: theme.mainText, fontWeight: "600", marginBottom: "10px", fontSize: "20px" }}>
                HackerRank
              </h3>
              <p style={{ color: theme.subText, marginBottom: "20px", lineHeight: "1.5" }}>
                Solve coding challenges, prepare for interviews, and improve your programming skills.
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span className="resource-link">Open Resource</span>
                <span style={{ color: "#3B82F6", fontSize: "18px" }}>↗</span>
              </div>
            </div>

            {/* CodeChef */}
            <div style={{ 
              background: theme.cardBg, 
              border: theme.cardBorder, 
              borderRadius: "12px", 
              padding: "25px", 
              transition: "all 0.3s ease",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-4px)";
              e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            }}
            onClick={() => window.open("https://www.codechef.com", "_blank")}
            >
              <h3 style={{ color: theme.mainText, fontWeight: "600", marginBottom: "10px", fontSize: "20px" }}>
                CodeChef
              </h3>
              <p style={{ color: theme.subText, marginBottom: "20px", lineHeight: "1.5" }}>
                Participate in coding contests and practice problems to enhance your competitive programming skills.
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span className="resource-link">Open Resource</span>
                <span style={{ color: "#3B82F6", fontSize: "18px" }}>↗</span>
              </div>
            </div>

            {/* GeeksforGeeks Practice */}
            <div style={{ 
              background: theme.cardBg, 
              border: theme.cardBorder, 
              borderRadius: "12px", 
              padding: "25px", 
              transition: "all 0.3s ease",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-4px)";
              e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            }}
            onClick={() => window.open("https://practice.geeksforgeeks.org", "_blank")}
            >
              <h3 style={{ color: theme.mainText, fontWeight: "600", marginBottom: "10px", fontSize: "20px" }}>
                GeeksforGeeks Practice
              </h3>
              <p style={{ color: theme.subText, marginBottom: "20px", lineHeight: "1.5" }}>
                Comprehensive platform for practicing data structures, algorithms, and coding problems.
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span className="resource-link">Open Resource</span>
                <span style={{ color: "#3B82F6", fontSize: "18px" }}>↗</span>
              </div>
            </div>

            {/* Codeforces */}
            <div style={{ 
              background: theme.cardBg, 
              border: theme.cardBorder, 
              borderRadius: "12px", 
              padding: "25px", 
              transition: "all 0.3s ease",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-4px)";
              e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            }}
            onClick={() => window.open("https://codeforces.com", "_blank")}
            >
              <h3 style={{ color: theme.mainText, fontWeight: "600", marginBottom: "10px", fontSize: "20px" }}>
                Codeforces
              </h3>
              <p style={{ color: theme.subText, marginBottom: "20px", lineHeight: "1.5" }}>
                Competitive programming platform with regular contests and a vast problem archive.
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span className="resource-link">Open Resource</span>
                <span style={{ color: "#3B82F6", fontSize: "18px" }}>↗</span>
              </div>
            </div>
          </div>
        </div>

        {/* Aptitude Practice Section */}
        <div style={{ marginBottom: "50px" }}>
          <h2 style={{ color: theme.mainText, fontWeight: "600", marginBottom: "25px", fontSize: "24px" }}>
            Aptitude Practice
          </h2>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "20px" 
          }}>
            {/* IndiaBix */}
            <div style={{ 
              background: theme.cardBg, 
              border: theme.cardBorder, 
              borderRadius: "12px", 
              padding: "25px", 
              transition: "all 0.3s ease",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-4px)";
              e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            }}
            onClick={() => window.open("https://www.indiabix.com", "_blank")}
            >
              <h3 style={{ color: theme.mainText, fontWeight: "600", marginBottom: "10px", fontSize: "20px" }}>
                IndiaBix
              </h3>
              <p style={{ color: theme.subText, marginBottom: "20px", lineHeight: "1.5" }}>
                Practice aptitude tests, verbal reasoning, and logical reasoning questions.
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span className="resource-link">Open Resource</span>
                <span style={{ color: "#3B82F6", fontSize: "18px" }}>↗</span>
              </div>
            </div>

            {/* PrepInsta */}
            <div style={{ 
              background: theme.cardBg, 
              border: theme.cardBorder, 
              borderRadius: "12px", 
              padding: "25px", 
              transition: "all 0.3s ease",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-4px)";
              e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            }}
            onClick={() => window.open("https://prepinsta.com", "_blank")}
            >
              <h3 style={{ color: theme.mainText, fontWeight: "600", marginBottom: "10px", fontSize: "20px" }}>
                PrepInsta
              </h3>
              <p style={{ color: theme.subText, marginBottom: "20px", lineHeight: "1.5" }}>
                Comprehensive aptitude preparation with practice tests and study materials.
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span className="resource-link">Open Resource</span>
                <span style={{ color: "#3B82F6", fontSize: "18px" }}>↗</span>
              </div>
            </div>

            {/* Freshersworld Aptitude */}
            <div style={{ 
              background: theme.cardBg, 
              border: theme.cardBorder, 
              borderRadius: "12px", 
              padding: "25px", 
              transition: "all 0.3s ease",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-4px)";
              e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            }}
            onClick={() => window.open("https://placement.freshersworld.com", "_blank")}
            >
              <h3 style={{ color: theme.mainText, fontWeight: "600", marginBottom: "10px", fontSize: "20px" }}>
                Freshersworld Aptitude
              </h3>
              <p style={{ color: theme.subText, marginBottom: "20px", lineHeight: "1.5" }}>
                Placement preparation platform with aptitude tests and interview questions.
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span className="resource-link">Open Resource</span>
                <span style={{ color: "#3B82F6", fontSize: "18px" }}>↗</span>
              </div>
            </div>

            {/* Testbook */}
            <div style={{ 
              background: theme.cardBg, 
              border: theme.cardBorder, 
              borderRadius: "12px", 
              padding: "25px", 
              transition: "all 0.3s ease",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-4px)";
              e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            }}
            onClick={() => window.open("https://testbook.com", "_blank")}
            >
              <h3 style={{ color: theme.mainText, fontWeight: "600", marginBottom: "10px", fontSize: "20px" }}>
                Testbook
              </h3>
              <p style={{ color: theme.subText, marginBottom: "20px", lineHeight: "1.5" }}>
                Online test preparation platform with mock tests and study materials.
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span className="resource-link">Open Resource</span>
                <span style={{ color: "#3B82F6", fontSize: "18px" }}>↗</span>
              </div>
            </div>
          </div>
        </div>

        {/* Communication Skills Section */}
        <div style={{ marginBottom: "50px" }}>
          <h2 style={{ color: theme.mainText, fontWeight: "600", marginBottom: "25px", fontSize: "24px" }}>
            Communication Skills
          </h2>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "20px" 
          }}>
            {/* Interview Preparation Tips */}
            <div style={{ 
              background: theme.cardBg, 
              border: theme.cardBorder, 
              borderRadius: "12px", 
              padding: "25px", 
              transition: "all 0.3s ease",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-4px)";
              e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            }}
            onClick={() => window.open("https://www.geeksforgeeks.org/interview-preparation-for-software-developer/", "_blank")}
            >
              <h3 style={{ color: theme.mainText, fontWeight: "600", marginBottom: "10px", fontSize: "20px" }}>
                Interview Preparation Tips
              </h3>
              <p style={{ color: theme.subText, marginBottom: "20px", lineHeight: "1.5" }}>
                Comprehensive guide for software developer interviews with tips and strategies.
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span className="resource-link">Open Resource</span>
                <span style={{ color: "#3B82F6", fontSize: "18px" }}>↗</span>
              </div>
            </div>

            {/* TED Talks */}
            <div style={{ 
              background: theme.cardBg, 
              border: theme.cardBorder, 
              borderRadius: "12px", 
              padding: "25px", 
              transition: "all 0.3s ease",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-4px)";
              e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            }}
            onClick={() => window.open("https://www.ted.com", "_blank")}
            >
              <h3 style={{ color: theme.mainText, fontWeight: "600", marginBottom: "10px", fontSize: "20px" }}>
                TED Talks
              </h3>
              <p style={{ color: theme.subText, marginBottom: "20px", lineHeight: "1.5" }}>
                Inspiring talks on various topics to improve communication and presentation skills.
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span className="resource-link">Open Resource</span>
                <span style={{ color: "#3B82F6", fontSize: "18px" }}>↗</span>
              </div>
            </div>

            {/* Toastmasters */}
            <div style={{ 
              background: theme.cardBg, 
              border: theme.cardBorder, 
              borderRadius: "12px", 
              padding: "25px", 
              transition: "all 0.3s ease",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-4px)";
              e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            }}
            onClick={() => window.open("https://www.toastmasters.org", "_blank")}
            >
              <h3 style={{ color: theme.mainText, fontWeight: "600", marginBottom: "10px", fontSize: "20px" }}>
                Toastmasters
              </h3>
              <p style={{ color: theme.subText, marginBottom: "20px", lineHeight: "1.5" }}>
                International organization dedicated to helping people improve their public speaking skills.
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span className="resource-link">Open Resource</span>
                <span style={{ color: "#3B82F6", fontSize: "18px" }}>↗</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resume & Interview Preparation Section */}
        <div style={{ marginBottom: "50px" }}>
          <h2 style={{ color: theme.mainText, fontWeight: "600", marginBottom: "25px", fontSize: "24px" }}>
            Resume & Interview Preparation
          </h2>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "20px" 
          }}>
            {/* Canva Resume Builder */}
            <div style={{ 
              background: theme.cardBg, 
              border: theme.cardBorder, 
              borderRadius: "12px", 
              padding: "25px", 
              transition: "all 0.3s ease",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-4px)";
              e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            }}
            onClick={() => window.open("https://www.canva.com/resumes", "_blank")}
            >
              <h3 style={{ color: theme.mainText, fontWeight: "600", marginBottom: "10px", fontSize: "20px" }}>
                Canva Resume Builder
              </h3>
              <p style={{ color: theme.subText, marginBottom: "20px", lineHeight: "1.5" }}>
                Create professional resumes with easy-to-use templates and design tools.
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span className="resource-link">Open Resource</span>
                <span style={{ color: "#3B82F6", fontSize: "18px" }}>↗</span>
              </div>
            </div>

            {/* InterviewBit Interview Guide */}
            <div style={{ 
              background: theme.cardBg, 
              border: theme.cardBorder, 
              borderRadius: "12px", 
              padding: "25px", 
              transition: "all 0.3s ease",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-4px)";
              e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            }}
            onClick={() => window.open("https://www.interviewbit.com/interview-guide", "_blank")}
            >
              <h3 style={{ color: theme.mainText, fontWeight: "600", marginBottom: "10px", fontSize: "20px" }}>
                InterviewBit Interview Guide
              </h3>
              <p style={{ color: theme.subText, marginBottom: "20px", lineHeight: "1.5" }}>
                Comprehensive interview preparation guide with coding problems and system design.
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span className="resource-link">Open Resource</span>
                <span style={{ color: "#3B82F6", fontSize: "18px" }}>↗</span>
              </div>
            </div>

            {/* Glassdoor Interview Questions */}
            <div style={{ 
              background: theme.cardBg, 
              border: theme.cardBorder, 
              borderRadius: "12px", 
              padding: "25px", 
              transition: "all 0.3s ease",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-4px)";
              e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            }}
            onClick={() => window.open("https://www.glassdoor.co.in/Interview", "_blank")}
            >
              <h3 style={{ color: theme.mainText, fontWeight: "600", marginBottom: "10px", fontSize: "20px" }}>
                Glassdoor Interview Questions
              </h3>
              <p style={{ color: theme.subText, marginBottom: "20px", lineHeight: "1.5" }}>
                Real interview questions shared by candidates from various companies.
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span className="resource-link">Open Resource</span>
                <span style={{ color: "#3B82F6", fontSize: "18px" }}>↗</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Learning Section */}
        <div style={{ marginBottom: "50px" }}>
          <h2 style={{ color: theme.mainText, fontWeight: "600", marginBottom: "25px", fontSize: "24px" }}>
            Technical Learning
          </h2>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "20px" 
          }}>
            {/* FreeCodeCamp */}
            <div style={{ 
              background: theme.cardBg, 
              border: theme.cardBorder, 
              borderRadius: "12px", 
              padding: "25px", 
              transition: "all 0.3s ease",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-4px)";
              e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            }}
            onClick={() => window.open("https://www.freecodecamp.org", "_blank")}
            >
              <h3 style={{ color: theme.mainText, fontWeight: "600", marginBottom: "10px", fontSize: "20px" }}>
                FreeCodeCamp
              </h3>
              <p style={{ color: theme.subText, marginBottom: "20px", lineHeight: "1.5" }}>
                Free coding bootcamp with interactive lessons and certifications in web development.
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span className="resource-link">Open Resource</span>
                <span style={{ color: "#3B82F6", fontSize: "18px" }}>↗</span>
              </div>
            </div>

            {/* Coursera */}
            <div style={{ 
              background: theme.cardBg, 
              border: theme.cardBorder, 
              borderRadius: "12px", 
              padding: "25px", 
              transition: "all 0.3s ease",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-4px)";
              e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            }}
            onClick={() => window.open("https://www.coursera.org", "_blank")}
            >
              <h3 style={{ color: theme.mainText, fontWeight: "600", marginBottom: "10px", fontSize: "20px" }}>
                Coursera
              </h3>
              <p style={{ color: theme.subText, marginBottom: "20px", lineHeight: "1.5" }}>
                Online learning platform offering courses from top universities and organizations.
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span className="resource-link">Open Resource</span>
                <span style={{ color: "#3B82F6", fontSize: "18px" }}>↗</span>
              </div>
            </div>

            {/* edX */}
            <div style={{ 
              background: theme.cardBg, 
              border: theme.cardBorder, 
              borderRadius: "12px", 
              padding: "25px", 
              transition: "all 0.3s ease",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-4px)";
              e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            }}
            onClick={() => window.open("https://www.edx.org", "_blank")}
            >
              <h3 style={{ color: theme.mainText, fontWeight: "600", marginBottom: "10px", fontSize: "20px" }}>
                edX
              </h3>
              <p style={{ color: theme.subText, marginBottom: "20px", lineHeight: "1.5" }}>
                Platform offering online courses from universities like MIT, Harvard, and more.
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span className="resource-link">Open Resource</span>
                <span style={{ color: "#3B82F6", fontSize: "18px" }}>↗</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Resources;
