import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../components/Logo";
import { useUser } from "../context/UserContext";

function Login() {
  const navigate = useNavigate();
  const { login, updateStudentProfile } = useUser();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("https://readiness-monitoring-system.onrender.com/login", formData);

      // Store user data in context first
      login({
        userId: res.data.userId,
        userName: res.data.userName,
        userEmail: res.data.userEmail,
        role: res.data.role
      });

      if (res.data.role === "admin") {
        alert("Login Successful");
        navigate("/admin/dashboard");
      } else {
        // Check for student profile
        try {
          const profileRes = await axios.get(`https://readiness-monitoring-system.onrender.com/student-profile-exists/${res.data.userEmail}`);

          // Consider profile complete ONLY IF it exists AND has required fields
          const profile = profileRes.data.profile;
          const isComplete = profileRes.data.exists &&
            profile &&
            profile.studentId &&
            profile.department &&
            profile.yearOfStudy;

          if (isComplete) {
            updateStudentProfile(profile);
            alert("Login Successful");
            navigate("/readiness");
          } else {
            // Not completely filled, send to profile
            alert("Please complete your profile to continue.");
            navigate("/student-profile", {
              state: { message: "Please complete your profile to access readiness assessments." }
            });
          }
        } catch (profileErr) {
          console.error("Profile check error:", profileErr);
          navigate("/student-profile");
        }
      }

    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f172a, #1e293b, #334155)"
      }}
    >
      <Card
        className="shadow-lg p-4"
        style={{
          width: "100%",
          maxWidth: "400px",
          borderRadius: "15px"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Logo size="medium" />
        </div>
        <h2 className="text-center mb-4">Login</h2>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Login As</Form.Label>
            <Form.Select name="role" value={formData.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </Form.Select>
          </Form.Group>

          <Button
            type="submit"
            className="w-100"
            style={{
              background: "linear-gradient(135deg, #6a11cb, #2575fc)",
              border: "none"
            }}
          >
            Login
          </Button>
        </Form>

        <p className="text-center mt-3">
          Don't have an account?{" "}
          <a
            href="/signup"
            style={{ color: "#6a11cb", textDecoration: "none", fontWeight: "bold" }}
          >
            Sign Up
          </a>
        </p>
      </Card>
    </div>
  );
}

export default Login;
