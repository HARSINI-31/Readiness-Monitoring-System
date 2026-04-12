import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../context/ThemeContext";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { getDashboardNav } from "../utils/navConfig";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";

function Contact() {
  const { theme } = useTheme();
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: ""
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous messages
    setSuccessMessage("");
    setErrorMessage("");

    console.log("Sending contact message:", {
      name: formData.fullName,
      email: formData.email,
      subject: formData.subject,
      message: formData.message
    });

    try {
      console.log("Making axios request to:", "https://readiness-monitoring-system.onrender.com/api/contact");
      const response = await axios.post("https://readiness-monitoring-system.onrender.com/api/contact", {
        name: formData.fullName,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Response received:", response);

      if (response.status === 201) {
        setSuccessMessage("Message sent successfully");
        // Clear form
        setFormData({
          fullName: "",
          email: "",
          subject: "",
          message: ""
        });
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(""), 5000);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      console.error("Error response:", error.response);
      setErrorMessage("Failed to send message. Please try again.");
      // Clear error message after 5 seconds
      setTimeout(() => setErrorMessage(""), 5000);
    }
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
        <h1 style={{ color: theme.mainText, fontWeight: "800", marginBottom: "20px" }}>
          Contact Us
        </h1>

        <p style={{ color: theme.subText, fontSize: "16px", marginBottom: "40px", lineHeight: "1.6" }}>
          If you have any questions, suggestions, or issues regarding the Readiness Monitoring System, please feel free to contact us.
        </p>

        {/* Two Column Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "start" }}>

          {/* Left Column - Contact Information */}
          <div>
            <h2 style={{ color: theme.mainText, fontWeight: "600", marginBottom: "30px", fontSize: "24px" }}>
              Get In Touch
            </h2>

            {/* Email Card */}
            <div style={{
              background: theme.cardBg,
              border: theme.cardBorder,
              borderRadius: "12px",
              padding: "25px",
              marginBottom: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              gap: "15px"
            }}>
              <div style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "20px"
              }}>
                <i className="bi bi-envelope-fill"></i>
              </div>
              <div>
                <h3 style={{ color: theme.mainText, fontWeight: "600", marginBottom: "5px", fontSize: "18px" }}>
                  Email Support
                </h3>
                <a
                  href="mailto:support@readinesssystem.com"
                  style={{
                    color: theme.subText,
                    textDecoration: "none",
                    fontSize: "16px"
                  }}
                >
                  support@readinesssystem.com
                </a>
              </div>
            </div>

            {/* Phone Card */}
            <div style={{
              background: theme.cardBg,
              border: theme.cardBorder,
              borderRadius: "12px",
              padding: "25px",
              marginBottom: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              gap: "15px"
            }}>
              <div style={{
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "20px"
              }}>
                <i className="bi bi-telephone-fill"></i>
              </div>
              <div>
                <h3 style={{ color: theme.mainText, fontWeight: "600", marginBottom: "5px", fontSize: "18px" }}>
                  Phone
                </h3>
                <span style={{ color: theme.subText, fontSize: "16px" }}>
                  +91 98765 43210
                </span>
              </div>
            </div>

            {/* Institution Card */}
            <div style={{
              background: theme.cardBg,
              border: theme.cardBorder,
              borderRadius: "12px",
              padding: "25px",
              marginBottom: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              gap: "15px"
            }}>
              <div style={{
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "20px"
              }}>
                <i className="bi bi-building-fill"></i>
              </div>
              <div>
                <h3 style={{ color: theme.mainText, fontWeight: "600", marginBottom: "5px", fontSize: "18px" }}>
                  Institution
                </h3>
                <span style={{ color: theme.subText, fontSize: "16px" }}>
                  Department of Electronics and Communication Engineering, BIT
                </span>
              </div>
            </div>

            {/* Address Card */}
            <div style={{
              background: theme.cardBg,
              border: theme.cardBorder,
              borderRadius: "12px",
              padding: "25px",
              marginBottom: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              gap: "15px"
            }}>
              <div style={{
                background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "20px"
              }}>
                <i className="bi bi-geo-alt-fill"></i>
              </div>
              <div>
                <h3 style={{ color: theme.mainText, fontWeight: "600", marginBottom: "5px", fontSize: "18px" }}>
                  Address
                </h3>
                <span style={{ color: theme.subText, fontSize: "16px" }}>
                  BIT, Sathyamangalam, Erode
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div>
            <h2 style={{ color: theme.mainText, fontWeight: "600", marginBottom: "30px", fontSize: "24px" }}>
              Send us a Message
            </h2>

            {successMessage && (
              <Alert variant="success" style={{ marginBottom: "20px" }}>
                {successMessage}
              </Alert>
            )}

            {errorMessage && (
              <Alert variant="danger" style={{ marginBottom: "20px" }}>
                {errorMessage}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: theme.mainText, fontWeight: "500" }}>
                  Full Name
                </Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  style={{
                    background: theme.inputBg,
                    color: theme.inputText,
                    border: `1px solid ${theme.inputText}30`,
                    borderRadius: "8px",
                    padding: "12px 16px",
                    fontSize: "16px"
                  }}
                  placeholder="Enter your full name"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ color: theme.mainText, fontWeight: "500" }}>
                  Email Address
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    background: theme.inputBg,
                    color: theme.inputText,
                    border: `1px solid ${theme.inputText}30`,
                    borderRadius: "8px",
                    padding: "12px 16px",
                    fontSize: "16px"
                  }}
                  placeholder="Enter your email address"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ color: theme.mainText, fontWeight: "500" }}>
                  Subject
                </Form.Label>
                <Form.Control
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  style={{
                    background: theme.inputBg,
                    color: theme.inputText,
                    border: `1px solid ${theme.inputText}30`,
                    borderRadius: "8px",
                    padding: "12px 16px",
                    fontSize: "16px"
                  }}
                  placeholder="Enter subject"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label style={{ color: theme.mainText, fontWeight: "500" }}>
                  Message
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  style={{
                    background: theme.inputBg,
                    color: theme.inputText,
                    border: `1px solid ${theme.inputText}30`,
                    borderRadius: "8px",
                    padding: "12px 16px",
                    fontSize: "16px",
                    resize: "vertical"
                  }}
                  placeholder="Enter your message"
                />
              </Form.Group>

              <Button
                type="submit"
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  fontSize: "16px",
                  fontWeight: "600",
                  width: "100%",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.6)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
                }}
              >
                Send Message
              </Button>
            </Form>
          </div>
        </div>

        {/* Footer Message */}
        <div style={{
          textAlign: "center",
          color: theme.subText,
          fontSize: "14px",
          fontStyle: "italic",
          marginTop: "40px"
        }}>
          We typically respond within 24–48 hours.
        </div>
      </main>
    </div>
  );
}

export default Contact;
