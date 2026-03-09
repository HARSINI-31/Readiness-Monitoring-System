import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import Logo from "../components/Logo";
import { useUser } from "../context/UserContext";

function StudentProfile() {
  const navigate = useNavigate();
  const { user, updateStudentProfile } = useUser();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    email: "",
    phone: "",
    classBatch: "",
    department: "",
    semester: ""
  });

  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/student-profile-exists/${user?.userEmail}`);
      if (res.data.exists) {
        const profile = res.data.profile;
        setFormData({
          studentId: profile.studentId || "",
          name: profile.name || "",
          email: profile.email || "",
          phone: profile.phone || "",
          classBatch: profile.classBatch || "",
          department: profile.department || "",
          semester: profile.semester || ""
        });
        // Update context with existing profile
        updateStudentProfile(profile);
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.studentId.trim()) newErrors.studentId = "Student ID is required";
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.classBatch.trim()) newErrors.classBatch = "Class/Batch is required";
    if (!formData.department.trim()) newErrors.department = "Department is required";
    if (!formData.semester.trim()) newErrors.semester = "Semester is required";
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
      const profileRes = await axios.post("http://localhost:5000/student-profile", {
        userId: user?.userId,
        userEmail: user?.userEmail,
        ...formData
      });

      // Update context with new profile
      updateStudentProfile(profileRes.data.profile);

      setMessage("Profile saved successfully!");
      setTimeout(() => {
        navigate("/readiness");
      }, 1500);
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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b, #334155)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <Card
        className="shadow-lg p-5"
        style={{
          width: "100%",
          maxWidth: "500px",
          borderRadius: "15px",
          background: "rgba(255, 255, 255, 0.95)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Logo size="medium" />
        </div>

        <h2 className="text-center mb-4" style={{ color: "#1e293b", fontWeight: "bold" }}>
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

        <Form onSubmit={handleSubmit}>
          {/* Student ID */}
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: "600", color: "#1e293b" }}>Student ID *</Form.Label>
            <Form.Control
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              isInvalid={!!errors.studentId}
              placeholder="e.g., CS2024001"
              style={{ borderRadius: "8px" }}
            />
            {errors.studentId && (
              <Form.Control.Feedback type="invalid">{errors.studentId}</Form.Control.Feedback>
            )}
          </Form.Group>

          {/* Full Name */}
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: "600", color: "#1e293b" }}>Full Name *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
              placeholder="Enter your full name"
              style={{ borderRadius: "8px" }}
            />
            {errors.name && (
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            )}
          </Form.Group>

          {/* Email */}
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: "600", color: "#1e293b" }}>Email *</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
              placeholder="Enter your email"
              style={{ borderRadius: "8px" }}
            />
            {errors.email && (
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            )}
          </Form.Group>

          {/* Phone */}
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: "600", color: "#1e293b" }}>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              style={{ borderRadius: "8px" }}
            />
          </Form.Group>

          {/* Department */}
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: "600", color: "#1e293b" }}>Department *</Form.Label>
            <Form.Select
              name="department"
              value={formData.department}
              onChange={handleChange}
              isInvalid={!!errors.department}
              style={{ borderRadius: "8px" }}
            >
              <option value="">Select Department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="Electrical">Electrical</option>
              <option value="Information Technology">Information Technology</option>
            </Form.Select>
            {errors.department && (
              <Form.Control.Feedback type="invalid">{errors.department}</Form.Control.Feedback>
            )}
          </Form.Group>

          {/* Class/Batch */}
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: "600", color: "#1e293b" }}>Class/Batch *</Form.Label>
            <Form.Control
              type="text"
              name="classBatch"
              value={formData.classBatch}
              onChange={handleChange}
              isInvalid={!!errors.classBatch}
              placeholder="e.g., 2024-A"
              style={{ borderRadius: "8px" }}
            />
            {errors.classBatch && (
              <Form.Control.Feedback type="invalid">{errors.classBatch}</Form.Control.Feedback>
            )}
          </Form.Group>

          {/* Semester */}
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: "600", color: "#1e293b" }}>Semester *</Form.Label>
            <Form.Select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              isInvalid={!!errors.semester}
              style={{ borderRadius: "8px" }}
            >
              <option value="">Select Semester</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
              <option value="7">Semester 7</option>
              <option value="8">Semester 8</option>
            </Form.Select>
            {errors.semester && (
              <Form.Control.Feedback type="invalid">{errors.semester}</Form.Control.Feedback>
            )}
          </Form.Group>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-100 mt-4"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #1e40af)",
              border: "none",
              padding: "12px",
              fontSize: "16px",
              fontWeight: "600",
              borderRadius: "8px",
              color: "#fff"
            }}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Profile & Continue"}
          </Button>
        </Form>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Button
            variant="link"
            onClick={() => navigate("/")}
            style={{ color: "#3b82f6", textDecoration: "none" }}
          >
            Back to Home
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default StudentProfile;
