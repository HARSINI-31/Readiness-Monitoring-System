import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Button, Form, Alert, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useUser } from "../context/UserContext";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../context/ThemeContext";
import { getDashboardNav } from "../utils/navConfig";

function StudentProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, studentProfile, updateStudentProfile, logout } = useUser();
  const { theme, isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [wasIncomplete, setWasIncomplete] = useState(false);

  const isProfileComplete = (profile) => {
    return profile &&
      profile.studentId &&
      profile.department &&
      profile.yearOfStudy;
  };

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location.state]);

  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    email: "",
    phone: "",
    department: "",
    yearOfStudy: ""
  });

  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get(`http://https://readiness-monitoring-system.onrender.com/student-profile-exists/${user?.userEmail}`);
      if (res.data.exists) {
        const profile = res.data.profile;
        setFormData({
          studentId: profile.studentId || "",
          name: profile.name || "",
          email: profile.email || "",
          phone: profile.phone || "",
          department: profile.department || "",
          yearOfStudy: profile.yearOfStudy || ""
        });

        // Check if it was incomplete when we loaded it
        const complete = isProfileComplete(profile);
        setWasIncomplete(!complete);

        // Update context
        updateStudentProfile(profile);

        // Show profile in read-only mode until user explicitly edits
        setIsEditing(false);
      } else {
        // New users should be able to edit right away
        setWasIncomplete(true);
        setIsEditing(true);
      }
    } catch (error) {
      console.log("Error fetching profile:", error);
    }
  }, [user?.userEmail, updateStudentProfile]);



  useEffect(() => {
    if (user?.userEmail) {
      fetchProfile();
    }
  }, [user?.userEmail, fetchProfile]);

  // Pre-fill known user data in case profile does not exist yet.
  // We only do this when NOT editing to avoid overwriting user input
  useEffect(() => {
    if (user && !isEditing) {
      setFormData((prev) => ({
        ...prev,
        email: prev.email || user.userEmail || "",
        name: prev.name || user.name || ""
      }));
    }
  }, [user, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setMessage("");
  };

  const handleCancelEdit = () => {
    // Revert to the last saved profile when canceling edits
    if (studentProfile) {
      setFormData({
        studentId: studentProfile.studentId || "",
        name: studentProfile.name || "",
        email: studentProfile.email || "",
        phone: studentProfile.phone || "",
        department: studentProfile.department || "",
        yearOfStudy: studentProfile.yearOfStudy || ""
      });
    }
    setErrors({});
    setMessage("");
    setIsEditing(false);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.studentId.trim()) newErrors.studentId = "Student ID is required";
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.department.trim()) newErrors.department = "Department is required";
    if (!formData.yearOfStudy.trim()) newErrors.yearOfStudy = "Year of Study is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const profileRes = await axios.post("http://https://readiness-monitoring-system.onrender.com/student-profile", {
        userId: user?.userId,
        userEmail: user?.userEmail,
        ...formData
      });

      setFormData({
        studentId: profileRes.data.profile.studentId || "",
        name: profileRes.data.profile.name || "",
        email: profileRes.data.profile.email || "",
        phone: profileRes.data.profile.phone || "",
        department: profileRes.data.profile.department || "",
        yearOfStudy: profileRes.data.profile.yearOfStudy || ""
      });

      // Update context with new profile
      updateStudentProfile(profileRes.data.profile);

      setMessage("Profile saved successfully!");
      setIsEditing(false);

      // Redirect ONLY IF it was mandatory (i.e., was incomplete before saving)
      if (wasIncomplete && isProfileComplete(profileRes.data.profile)) {
        setWasIncomplete(false);
        setTimeout(() => {
          navigate("/readiness");
        }, 1500);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      let errorMsg = "Error saving profile";

      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        errorMsg = error.message;
      } else if (error.response?.status === 400) {
        errorMsg = "Please fill all required fields correctly";
      } else if (error.response?.status === 500) {
        errorMsg = "Server error. Please check if backend is running.";
      }

      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

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
        <div style={{ width: "100%", maxWidth: "800px" }}>
          <h2 className="mb-4" style={{ color: theme.mainText, fontWeight: "bold" }}>
            Student Profile
          </h2>

          {message && (
            <Alert
              variant={message.includes("successfully") ? "success" : "danger"}
              onClose={() => setMessage("")}
              dismissible
            >
              {message}
            </Alert>
          )}

          {/* Profile Header Card */}
          <Card
            className="shadow-sm mb-4"
            style={{
              borderRadius: "15px",
              background: theme.cardBg,
              border: theme.cardBorder !== "none" ? theme.cardBorder : "1px solid rgba(203, 213, 225, 0.2)",
              color: theme.mainText,
              overflow: "hidden"
            }}
          >
            <div style={{
              height: "100px",
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              position: "relative"
            }}>
              {/* Avatar */}
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  backgroundColor: theme.bg,
                  border: `4px solid ${theme.cardBg}`,
                  position: "absolute",
                  bottom: "-50px",
                  left: "30px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "40px",
                  color: "#3b82f6",
                  fontWeight: "bold",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }}
              >
                {user?.userName ? user.userName.charAt(0).toUpperCase() : "S"}
              </div>
            </div>

            <div style={{ padding: "60px 30px 30px 30px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ margin: 0, fontWeight: "bold", color: theme.mainText }}>
                  {user?.userName || "Student Name"}
                </h3>
                <p style={{ margin: "5px 0 0 0", color: theme.subText, fontSize: "15px" }}>
                  {user?.userEmail || "student@example.com"}
                </p>
              </div>
              <Button
                variant={isEditing ? "outline-danger" : "outline-primary"}
                style={{
                  borderRadius: "20px",
                  padding: "6px 20px",
                  fontWeight: "600",
                  borderColor: isEditing ? "#ef4444" : "#3b82f6",
                  color: isEditing ? (isDarkMode ? "#fca5a5" : "#ef4444") : (isDarkMode ? "#60a5fa" : "#3b82f6")
                }}
                onClick={isEditing ? handleCancelEdit : handleEditClick}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = isEditing ? "#ef4444" : "#3b82f6";
                  e.target.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = isEditing ? (isDarkMode ? "#fca5a5" : "#ef4444") : (isDarkMode ? "#60a5fa" : "#3b82f6");
                }}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </Card>

          {/* Form Container Card */}
          <Card
            className="shadow-sm p-4 p-md-5"
            style={{
              borderRadius: "15px",
              background: theme.cardBg,
              border: theme.cardBorder !== "none" ? theme.cardBorder : "1px solid rgba(203, 213, 225, 0.2)",
              color: theme.mainText,
            }}
          >
            <h4 style={{ marginBottom: "25px", fontWeight: "600", color: theme.mainText, borderBottom: `1px solid ${theme.cardBorder === "none" ? "rgba(203, 213, 225, 0.2)" : theme.cardBorder}`, paddingBottom: "15px" }}>
              Personal Information
            </h4>

            <Form onSubmit={handleSubmit}>
              {/* Row 1: Student ID & Full Name */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: "600", color: theme.subText, fontSize: "14px" }}>Student ID *</Form.Label>
                    <Form.Control
                      type="text"
                      name="studentId"
                      value={formData.studentId || ""}
                      onChange={handleChange}
                      isInvalid={!!errors.studentId}
                      readOnly={!isEditing}
                      autoFocus={isEditing}
                      autoComplete="off"
                      placeholder="e.g., CS2024001"
                      style={{
                        borderRadius: "8px",
                        backgroundColor: isEditing ? "#ffffff" : theme.inputBg,
                        color: isEditing ? "#000000" : theme.inputText,
                        border: isEditing ? "2px solid #3b82f6" : "1px solid rgba(203, 213, 225, 0.3)",
                        padding: "10px 15px",
                        pointerEvents: "auto"
                      }}
                    />
                    {errors.studentId && (
                      <Form.Control.Feedback type="invalid">{errors.studentId}</Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: "600", color: theme.subText, fontSize: "14px" }}>Full Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleChange}
                      isInvalid={!!errors.name}
                      readOnly={!isEditing}
                      autoComplete="off"
                      placeholder="Enter your full name"
                      style={{
                        borderRadius: "8px",
                        backgroundColor: isEditing ? "#ffffff" : theme.inputBg,
                        color: isEditing ? "#000000" : theme.inputText,
                        border: isEditing ? "2px solid #3b82f6" : "1px solid rgba(203, 213, 225, 0.3)",
                        padding: "10px 15px",
                        pointerEvents: "auto"
                      }}
                    />
                    {errors.name && (
                      <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              {/* Row 2: Email & Phone */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: "600", color: theme.subText, fontSize: "14px" }}>Email *</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                      readOnly={!isEditing}
                      autoComplete="off"
                      placeholder="Enter your email"
                      style={{
                        borderRadius: "8px",
                        backgroundColor: isEditing ? "#ffffff" : theme.inputBg,
                        color: isEditing ? "#000000" : theme.inputText,
                        border: isEditing ? "2px solid #3b82f6" : "1px solid rgba(203, 213, 225, 0.3)",
                        padding: "10px 15px",
                        pointerEvents: "auto"
                      }}
                    />
                    {errors.email && (
                      <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: "600", color: theme.subText, fontSize: "14px" }}>Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      autoComplete="off"
                      placeholder="Enter your phone number"
                      style={{
                        borderRadius: "8px",
                        backgroundColor: isEditing ? "#ffffff" : theme.inputBg,
                        color: isEditing ? "#000000" : theme.inputText,
                        border: isEditing ? "2px solid #3b82f6" : "1px solid rgba(203, 213, 225, 0.3)",
                        padding: "10px 15px",
                        pointerEvents: "auto"
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Row 3: Department & Year of Study */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: "600", color: theme.subText, fontSize: "14px" }}>Department *</Form.Label>
                    <Form.Select
                      name="department"
                      value={formData.department || ""}
                      onChange={handleChange}
                      isInvalid={!!errors.department}
                      disabled={!isEditing}
                      style={{
                        borderRadius: "8px",
                        backgroundColor: isEditing ? "#ffffff" : theme.inputBg,
                        color: isEditing ? "#000000" : theme.inputText,
                        border: isEditing ? "2px solid #3b82f6" : "1px solid rgba(203, 213, 225, 0.3)",
                        padding: "10px 15px",
                        pointerEvents: "auto"
                      }}
                    >
                      <option value="">Select Department</option>
                      <option value="ECE">ECE</option>
                      <option value="EEE">EEE</option>
                      <option value="CSE">CSE</option>
                      <option value="IT">IT</option>
                      <option value="CIVIL">CIVIL</option>
                    </Form.Select>
                    {errors.department && (
                      <Form.Control.Feedback type="invalid">{errors.department}</Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: "600", color: theme.subText, fontSize: "14px" }}>Year of Study *</Form.Label>
                    <Form.Select
                      name="yearOfStudy"
                      value={formData.yearOfStudy || ""}
                      onChange={handleChange}
                      isInvalid={!!errors.yearOfStudy}
                      disabled={!isEditing}
                      style={{
                        borderRadius: "8px",
                        backgroundColor: isEditing ? "#ffffff" : theme.inputBg,
                        color: isEditing ? "#000000" : theme.inputText,
                        border: isEditing ? "2px solid #3b82f6" : "1px solid rgba(203, 213, 225, 0.3)",
                        padding: "10px 15px",
                        pointerEvents: "auto"
                      }}
                    >
                      <option value="">Select Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </Form.Select>
                    {errors.yearOfStudy && (
                      <Form.Control.Feedback type="invalid">{errors.yearOfStudy}</Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              {/* Submit Button */}
              <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                <Button
                  type="submit"
                  style={{
                    background: "linear-gradient(135deg, #3b82f6, #1e40af)",
                    border: "none",
                    padding: "12px 40px",
                    fontSize: "16px",
                    fontWeight: "600",
                    borderRadius: "30px",
                    color: "#fff",
                    boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.4)"
                  }}
                  disabled={loading || !isEditing}
                >
                  {loading ? "Saving..." : (wasIncomplete ? "Save Profile & Continue" : "Save Changes")}
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default StudentProfile;
