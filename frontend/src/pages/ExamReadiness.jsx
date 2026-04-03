import React, { useState, useEffect } from "react";
import { Card, Button, Form, Table, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";
import { getDashboardNav } from "../utils/navConfig";

function ExamReadiness() {
  const navigate = useNavigate();
  const { user, studentProfile, logout } = useUser();
  const isAdmin = user?.role === "admin" || user?.userType === "admin";
  const { theme } = useTheme();
  const [profileCheckLoading, setProfileCheckLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== "admin") {
      const isComplete = studentProfile && 
                        studentProfile.studentId && 
                        studentProfile.department && 
                        studentProfile.yearOfStudy;

      if (!isComplete) {
        navigate("/student-profile", { 
          state: { message: "Please complete your profile to access readiness assessments." } 
        });
      } else {
        setProfileCheckLoading(false);
      }
    } else {
      setProfileCheckLoading(false);
    }
  }, [user, studentProfile, navigate]);


  // Department subjects mapping (memoized to avoid changing reference between renders)
  const departmentSubjects = React.useMemo(
    () => ({
      CSE: [
        { code: "CS101", name: "Data Structures & Algorithms" },
        { code: "CS102", name: "Database Management Systems" },
        { code: "CS103", name: "Operating Systems" },
        { code: "CS104", name: "Computer Networks" },
        { code: "CS105", name: "Software Engineering" }
      ],
      IT: [
        { code: "IT101", name: "Information Technology Fundamentals" },
        { code: "IT102", name: "Web Technologies" },
        { code: "IT103", name: "Cyber Security" },
        { code: "IT104", name: "Data Analytics" },
        { code: "IT105", name: "Cloud Computing" }
      ],
      ECE: [
        { code: "EC101", name: "Digital Electronics" },
        { code: "EC102", name: "Analog Electronics" },
        { code: "EC103", name: "Signals & Systems" },
        { code: "EC104", name: "Communication Systems" },
        { code: "EC105", name: "Microprocessors" }
      ],
      EEE: [
        { code: "EE101", name: "Power Systems" },
        { code: "EE102", name: "Control Systems" },
        { code: "EE103", name: "Electrical Machines" },
        { code: "EE104", name: "Power Electronics" },
        { code: "EE105", name: "Renewable Energy" }
      ],
      CIVIL: [
        { code: "CE101", name: "Structural Analysis" },
        { code: "CE102", name: "Geotechnical Engineering" },
        { code: "CE103", name: "Transportation Engineering" },
        { code: "CE104", name: "Environmental Engineering" },
        { code: "CE105", name: "Construction Management" }
      ]
    }),
    []
  );

  // Student form data - subjects include per-subject marks and metrics
  const [formData, setFormData] = useState({
    subjects: []
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  // Initialize subjects based on student's department
  useEffect(() => {
    if (studentProfile?.department && departmentSubjects[studentProfile.department]) {
      const subjects = departmentSubjects[studentProfile.department].map(subject => ({
        code: subject.code,
        name: subject.name,
        internalMarks: "",
        assignmentCompletion: "",
        attendance: "",
        studyHours: ""
      }));
      setFormData(prev => ({ 
        ...prev, 
        subjects,
        department: studentProfile.department // Store the department in form state
      }));
    }
  }, [studentProfile?.department, departmentSubjects]);

  // Admin view data
  const [allResults, setAllResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedStudent, setExpandedStudent] = useState(null);

  useEffect(() => {
    if (isAdmin) {
      fetchAllExamResults();
    }
  }, [isAdmin]);

  const fetchAllExamResults = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/all-exam-results");
      setAllResults(res.data || []);
    } catch (error) {
      console.error("Error fetching exam results:", error);
      setAllResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Group results by student
  const groupedByStudent = allResults.reduce((acc, result) => {
    const studentName = result.studentName || "Unknown";
    if (!acc[studentName]) {
      acc[studentName] = [];
    }
    acc[studentName].push(result);
    return acc;
  }, {});

  // Filter students based on search query
  const filteredStudents = Object.entries(groupedByStudent).filter(([studentName]) =>
    studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort attempts by date (latest first)
  const sortAttempts = (attempts) => {
    return [...attempts].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || 0);
      const dateB = new Date(b.createdAt || b.date || 0);
      return dateB - dateA;
    });
  };

  const handleSubjectChange = (index, field, value) => {
    setFormData(prev => {
      const updatedSubjects = [...prev.subjects];
      updatedSubjects[index] = { ...updatedSubjects[index], [field]: value };
      return { ...prev, subjects: updatedSubjects };
    });

    // Real-time validation for the specific field
    let specificErrorKey = `subject${index}`;
    let errorMessage = "";
    let isValid = true;

    if (field === 'internalMarks') {
      specificErrorKey += 'Internal';
      errorMessage = "Internal marks must be between 0 and 100";
      isValid = value !== "" && value >= 0 && value <= 100;
    } else if (field === 'assignmentCompletion') {
      specificErrorKey += 'Assignment';
      errorMessage = "Assignment completion must be between 0 and 100";
      isValid = value !== "" && value >= 0 && value <= 100;
    } else if (field === 'attendance') {
      specificErrorKey += 'Attendance';
      errorMessage = "Attendance must be between 0 and 100";
      isValid = value !== "" && value >= 0 && value <= 100;
    } else if (field === 'studyHours') {
      specificErrorKey += 'StudyHours';
      errorMessage = "Study hours must be between 0 and 10";
      isValid = value !== "" && value >= 0 && value <= 10;
    }

    setErrors(prevErrors => {
      const nextErrors = { ...prevErrors };
      if (!isValid) {
        nextErrors[specificErrorKey] = errorMessage;
      } else {
        delete nextErrors[specificErrorKey];
      }
      
      // If no errors left, clear general error too
      if (Object.keys(nextErrors).length === 0) {
        setGeneralError("");
      }
      
      return nextErrors;
    });
  };

  const isFormValid = () => {
    if (Object.keys(errors).length > 0) return false;
    if (formData.subjects.length === 0) return false;
    
    return formData.subjects.every(subject => 
      subject.internalMarks !== "" && subject.internalMarks >= 0 && subject.internalMarks <= 100 &&
      subject.assignmentCompletion !== "" && subject.assignmentCompletion >= 0 && subject.assignmentCompletion <= 100 &&
      subject.attendance !== "" && subject.attendance >= 0 && subject.attendance <= 100 &&
      subject.studyHours !== "" && subject.studyHours >= 0 && subject.studyHours <= 10
    );
  };


  const validateForm = () => {
    const newErrors = {};

    // Validate subjects
    formData.subjects.forEach((subject, index) => {
      if (subject.internalMarks === "" || subject.internalMarks < 0 || subject.internalMarks > 100) {
        newErrors[`subject${index}Internal`] = "Internal marks must be between 0 and 100";
      }
      if (subject.assignmentCompletion === "" || subject.assignmentCompletion < 0 || subject.assignmentCompletion > 100) {
        newErrors[`subject${index}Assignment`] = "Assignment completion must be between 0 and 100";
      }
      if (subject.attendance === "" || subject.attendance < 0 || subject.attendance > 100) {
        newErrors[`subject${index}Attendance`] = "Attendance must be between 0 and 100";
      }
      if (subject.studyHours === "" || subject.studyHours < 0 || subject.studyHours > 10) {
        newErrors[`subject${index}StudyHours`] = "Study hours must be between 0 and 10";
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setGeneralError("Please correct the errors below before submitting.");
    } else {
      setGeneralError("");
    }
    return Object.keys(newErrors).length === 0;
  };

  const calculateAverages = () => {
    const subjects = formData.subjects || [];
    if (!subjects.length) {
      return {
        internal: 0,
        unitTest: 0,
        midSem: 0,
        assignment: 0,
        attendance: 0,
        studyHours: 0
      };
    }

    const totals = subjects.reduce(
      (acc, subject) => ({
        internal: acc.internal + Number(subject.internalMarks || 0),
        assignment: acc.assignment + Number(subject.assignmentCompletion || 0),
        attendance: acc.attendance + Number(subject.attendance || 0),
        studyHours: acc.studyHours + Number(subject.studyHours || 0),
      }),
      {
        internal: 0,
        assignment: 0,
        attendance: 0,
        studyHours: 0,
      }
    );

    const count = subjects.length;
    const round = (val) => Math.round(val * 10) / 10;

    return {
      internal: round(totals.internal / count),
      assignment: round(totals.assignment / count),
      attendance: round(totals.attendance / count),
      studyHours: round(totals.studyHours / count),
    };
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSubmit = async () => {
    setGeneralError("");
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/exam-calculate",
        {
          studentId: studentProfile?.studentId,
          studentEmail: user?.userEmail,
          studentName: user?.userName,
          department: studentProfile?.department,
          subjects: formData.subjects
        }
      );
      navigate("/exam-results", { state: res.data });
    } catch (error) {
      console.error(error);
      alert("Error calculating exam readiness");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (overall) => {
    if (overall >= 80) return "#10b981";
    if (overall >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const getStatusText = (overall) => {
    if (overall >= 80) return "Ready";
    if (overall >= 60) return "Moderately Ready";
    return "Not Ready";
  };

  if (profileCheckLoading && user?.role !== "admin") {
    return <div style={{ background: theme.bg, minHeight: "100vh" }}></div>;
  }

  // ADMIN VIEW
  if (isAdmin) {
    return (
      <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: theme.mainText }}>
        <Sidebar
          navItems={getDashboardNav()}
          showLogout={true}
          onLogout={handleLogout}
          userName={user?.name || "Admin"}
        />

        <main style={{ marginLeft: "280px", flex: 1, padding: "40px 20px", overflowY: "auto" }}>
          <h1 style={{ color: theme.mainText, fontSize: "36px", marginBottom: "30px", fontWeight: "bold" }}>
            📚 Exam Readiness Results
          </h1>

          {/* Search Bar */}
          <div style={{ marginBottom: "30px" }}>
            <div style={{ display: "flex", gap: "10px", maxWidth: "500px" }}>
              <div style={{ flex: 1, position: "relative" }}>
                <input
                  type="text"
                  placeholder="Search by student name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "2px solid #3b82f6",
                    backgroundColor: "#1e293b",
                    color: "#ffffff",
                    fontSize: "14px",
                    outline: "none",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#60a5fa")}
                  onBlur={(e) => (e.target.style.borderColor = "#3b82f6")}
                />
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{
                    padding: "12px 16px",
                    backgroundColor: "#ef4444",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#dc2626")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#ef4444")}
                >
                  ✕ Clear
                </button>
              )}
            </div>
          </div>

          {/* Student Folders */}
          {loading ? (
            <div style={{ color: theme.subText, textAlign: "center", padding: "40px" }}>
              Loading results...
            </div>
          ) : filteredStudents.length === 0 ? (
            <div
              style={{
                color: "#cbd5e1",
                textAlign: "center",
                padding: "40px",
                fontSize: "18px",
              }}
            >
              {searchQuery ? "❌ No students found" : "No results available"}
            </div>
          ) : (
            <div style={{ display: "grid", gap: "16px" }}>
              {filteredStudents.map(([studentName, attempts]) => {
                const isExpanded = expandedStudent === studentName;
                const sortedAttempts = sortAttempts(attempts);
                const avgOverall = (
                  sortedAttempts.reduce((sum, a) => sum + (a.overall || 0), 0) /
                  sortedAttempts.length
                ).toFixed(1);

                return (
                  <div key={studentName}>
                    {/* Student Folder Card */}
                    <Card
                      onClick={() =>
                        setExpandedStudent(isExpanded ? null : studentName)
                      }
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#1e293b",
                        border: "2px solid #3b82f6",
                        borderRadius: "12px",
                        padding: "20px",
                        transition: "all 0.3s ease",
                        transform: isExpanded ? "scale(1.02)" : "scale(1)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#60a5fa";
                        e.currentTarget.style.boxShadow =
                          "0 8px 24px rgba(59, 130, 246, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#3b82f6";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                          <span style={{ fontSize: "32px" }}>📁</span>
                          <div>
                            <h3 style={{ color: "#fff", margin: 0, marginBottom: "8px" }}>
                              {studentName}
                            </h3>
                            <div style={{ color: "#cbd5e1", fontSize: "14px" }}>
                              <span style={{ marginRight: "20px" }}>
                                Attempts: <strong>{sortedAttempts.length}</strong>
                              </span>
                              <span>
                                Avg Score: <strong>{avgOverall}%</strong>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: "24px",
                            transition: "transform 0.3s ease",
                            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                          }}
                        >
                          ▼
                        </div>
                      </div>
                    </Card>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div
                        style={{
                          marginTop: "12px",
                          backgroundColor: theme.cardBg,
                          borderRadius: "12px",
                          padding: "20px",
                          border: theme.cardBorder !== "none" ? theme.cardBorder : "1px solid rgba(203, 213, 225, 0.2)",
                          overflowX: "auto",
                        }}
                      >
                        <table
                          style={{
                            width: "100%",
                            color: "#cbd5e1",
                            fontSize: "14px",
                            borderCollapse: "collapse",
                          }}
                        >
                          <thead>
                            <tr style={{ borderBottom: "2px solid #3b82f6" }}>
                              <th style={{ padding: "12px", textAlign: "left", color: "#60a5fa" }}>
                                Dept
                              </th>
                              <th style={{ padding: "12px", textAlign: "left", color: "#60a5fa" }}>
                                Internal Avg
                              </th>
                              <th style={{ padding: "12px", textAlign: "left", color: "#60a5fa" }}>
                                Assignment Avg
                              </th>
                              <th style={{ padding: "12px", textAlign: "left", color: "#60a5fa" }}>
                                Attendance Avg
                              </th>
                              <th style={{ padding: "12px", textAlign: "left", color: "#60a5fa" }}>
                                Study Hours Avg
                              </th>
                              <th style={{ padding: "12px", textAlign: "left", color: "#60a5fa" }}>
                                Overall %
                              </th>
                              <th style={{ padding: "12px", textAlign: "left", color: "#60a5fa" }}>
                                Status
                              </th>
                              <th style={{ padding: "12px", textAlign: "left", color: "#60a5fa" }}>
                                Date
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {sortedAttempts.map((attempt, idx) => {
                              const stats = attempt.subjects && attempt.subjects.length > 0 ? {
                                internal: Math.round(attempt.subjects.reduce((sum, s) => sum + (s.internalMarks || 0), 0) / attempt.subjects.length),
                                assignment: Math.round(attempt.subjects.reduce((sum, s) => sum + (s.assignmentCompletion || 0), 0) / attempt.subjects.length),
                                attendance: Math.round(attempt.subjects.reduce((sum, s) => sum + (s.attendance || 0), 0) / attempt.subjects.length),
                                studyHours: (attempt.subjects.reduce((sum, s) => sum + (Number(s.studyHours) || 0), 0) / attempt.subjects.length).toFixed(1)
                              } : {
                                internal: attempt.internalAssignments || 0,
                                assignment: attempt.assignmentCompletion || 0,
                                attendance: attempt.attendance || 0,
                                studyHours: attempt.studyHours || 0
                              };

                              return (
                                <tr
                                  key={idx}
                                  style={{
                                    borderBottom: "1px solid #334155",
                                    backgroundColor: idx % 2 === 0 ? "rgba(30, 41, 59, 0.5)" : "transparent",
                                  }}
                                >
                                  <td style={{ padding: "12px" }}>
                                    {attempt.department || "N/A"}
                                  </td>
                                  <td style={{ padding: "12px" }}>{stats.internal}%</td>
                                  <td style={{ padding: "12px" }}>{stats.assignment}%</td>
                                  <td style={{ padding: "12px" }}>{stats.attendance}%</td>
                                  <td style={{ padding: "12px" }}>{stats.studyHours}/10</td>
                                  <td style={{ padding: "12px", fontWeight: "bold" }}>
                                    {attempt.overall || 0}%
                                  </td>
                                  <td style={{ padding: "12px" }}>
                                    <span
                                      style={{
                                        backgroundColor: getStatusColor(attempt.overall || 0),
                                        color: "#fff",
                                        padding: "4px 12px",
                                        borderRadius: "4px",
                                        fontSize: "12px",
                                        fontWeight: "600",
                                      }}
                                    >
                                      {getStatusText(attempt.overall || 0)}
                                    </span>
                                  </td>
                                  <td style={{ padding: "12px", fontSize: "12px" }}>
                                    {attempt.createdAt
                                      ? new Date(attempt.createdAt).toLocaleDateString()
                                      : attempt.date || "N/A"}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    );
  }

  // STUDENT VIEW (existing code)
  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        display: "flex",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: theme.mainText
      }}
    >
      <style>
        {`
          .form-control::placeholder {
            color: #6b7280 !important;
            opacity: 1 !important;
          }
        `}
      </style>
      <Sidebar
        navItems={getDashboardNav()}
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
          alignItems: "center",
          padding: "40px 20px",
        }}
      >
        <h1 style={{ color: theme.mainText, fontSize: "48px", marginBottom: "20px" }}>
          📝 Exam Readiness Assessment
        </h1>

        <p style={{ color: theme.subText, fontSize: "20px", marginBottom: "40px", textAlign: "center" }}>
          Evaluate your preparation based on subject-wise performance and study habits.
        </p>

        {!studentProfile || !studentProfile.department ? (
          <div style={{ textAlign: "center", maxWidth: "600px", padding: "40px", background: theme.cardBg, borderRadius: "20px", border: theme.cardBorder !== "none" ? theme.cardBorder : "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ fontSize: "50px", marginBottom: "20px" }}>👤</div>
            <h3 style={{ color: theme.mainText, marginBottom: "15px" }}>Profile Incomplete</h3>
            <p style={{ color: theme.subText, fontSize: "18px", marginBottom: "30px" }}>
              Please complete your profile to start the readiness assessment.
            </p>
            <Button 
              style={{ 
                background: "linear-gradient(135deg, #3b82f6, #1e40af)", 
                border: "none", 
                borderRadius: "25px", 
                padding: "12px 35px", 
                fontWeight: "600",
                boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)" 
              }} 
              onClick={() => navigate("/student-profile")}
            >
              Complete Profile Now
            </Button>
          </div>
        ) : (
          <Card
            className="p-4 shadow-lg"
            style={{
              width: "100%",
              maxWidth: "1200px",
              borderRadius: "20px",
              background: theme.cardBg,
              border: theme.cardBorder !== "none" ? theme.cardBorder : "none",
              color: theme.mainText
            }}
          >
            <div className="mb-4">
              <h4 style={{ color: theme.mainText, marginBottom: "20px" }}>
                Department: <span style={{ color: "#3b82f6", fontWeight: "bold" }}>{studentProfile.department}</span>
              </h4>

              {/* Subject Performance Table */}
              <div style={{ marginBottom: "30px" }}>
                <h5 style={{ color: theme.mainText, marginBottom: "15px" }}>Subject-wise Performance</h5>
                {generalError && (
                  <Alert variant="danger" style={{ marginBottom: "15px" }}>
                    {generalError}
                  </Alert>
                )}
                <div style={{ overflowX: "auto" }}>
                  <Table
                    responsive
                    style={{
                      background: theme.cardBg,
                      color: theme.mainText,
                      borderRadius: "10px",
                      overflow: "hidden"
                    }}
                  >
                    <thead style={{ background: "#3b82f6", color: "#fff" }}>
                      <tr>
                        <th style={{ padding: "12px", border: "none" }}>Subject Code</th>
                        <th style={{ padding: "12px", border: "none" }}>Subject Name</th>
                        <th style={{ padding: "12px", border: "none" }}>Internal Marks (0-100)</th>
                        <th style={{ padding: "12px", border: "none" }}>Assignment % (0-100)</th>
                        <th style={{ padding: "12px", border: "none" }}>Attendance %</th>
                        <th style={{ padding: "12px", border: "none" }}>Study Hours (0-10)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.subjects.map((subject, index) => (
                        <tr key={index} style={{ borderBottom: "1px solid rgba(203, 213, 225, 0.2)" }}>
                          <td style={{ padding: "12px", fontWeight: "bold", color: "#3b82f6" }}>
                            {subject.code}
                          </td>
                          <td style={{ padding: "12px", color: "#3b82f6", fontWeight: "500" }}>
                            {subject.name}
                          </td>
                          <td style={{ padding: "12px" }}>
                            <Form.Control
                              type="number"
                              min="0"
                              max="100"
                              value={subject.internalMarks}
                              onChange={(e) => handleSubjectChange(index, 'internalMarks', e.target.value)}
                              isInvalid={!!errors[`subject${index}Internal`]}
                              placeholder="0-100"
                              style={{
                                backgroundColor: "#f5f7fa",
                                color: "#1f2933",
                                border: "1px solid #cbd5e1",
                                borderRadius: "6px",
                                transition: "all 0.3s ease"
                              }}
                              onFocus={(e) => {
                                e.target.style.borderColor = "#4f46e5";
                                e.target.style.boxShadow = "0 0 0 2px rgba(79,70,229,0.2)";
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = "#cbd5e1";
                                e.target.style.boxShadow = "none";
                              }}
                            />
                            {errors[`subject${index}Internal`] && (
                              <Form.Control.Feedback type="invalid" style={{ fontSize: "12px" }}>
                                {errors[`subject${index}Internal`]}
                              </Form.Control.Feedback>
                            )}
                          </td>
                          <td style={{ padding: "12px" }}>
                            <Form.Control
                              type="number"
                              min="0"
                              max="100"
                              value={subject.assignmentCompletion}
                              onChange={(e) => handleSubjectChange(index, 'assignmentCompletion', e.target.value)}
                              isInvalid={!!errors[`subject${index}Assignment`]}
                              placeholder="0-100"
                              style={{
                                backgroundColor: "#f5f7fa",
                                color: "#1f2933",
                                border: "1px solid #cbd5e1",
                                borderRadius: "6px",
                                transition: "all 0.3s ease"
                              }}
                              onFocus={(e) => {
                                e.target.style.borderColor = "#4f46e5";
                                e.target.style.boxShadow = "0 0 0 2px rgba(79,70,229,0.2)";
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = "#cbd5e1";
                                e.target.style.boxShadow = "none";
                              }}
                            />
                            {errors[`subject${index}Assignment`] && (
                              <Form.Control.Feedback type="invalid" style={{ fontSize: "12px" }}>
                                {errors[`subject${index}Assignment`]}
                              </Form.Control.Feedback>
                            )}
                          </td>
                          <td style={{ padding: "12px" }}>
                            <Form.Control
                              type="number"
                              min="0"
                              max="100"
                              value={subject.attendance}
                              onChange={(e) => handleSubjectChange(index, 'attendance', e.target.value)}
                              isInvalid={!!errors[`subject${index}Attendance`]}
                              placeholder="0-100"
                              style={{
                                backgroundColor: "#f5f7fa",
                                color: "#1f2933",
                                border: "1px solid #cbd5e1",
                                borderRadius: "6px",
                                transition: "all 0.3s ease"
                              }}
                              onFocus={(e) => {
                                e.target.style.borderColor = "#4f46e5";
                                e.target.style.boxShadow = "0 0 0 2px rgba(79,70,229,0.2)";
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = "#cbd5e1";
                                e.target.style.boxShadow = "none";
                              }}
                            />
                            {errors[`subject${index}Attendance`] && (
                              <Form.Control.Feedback type="invalid" style={{ fontSize: "12px" }}>
                                {errors[`subject${index}Attendance`]}
                              </Form.Control.Feedback>
                            )}
                          </td>
                          <td style={{ padding: "12px" }}>
                            <Form.Control
                              type="number"
                              min="0"
                              max="10"
                              step="0.5"
                              value={subject.studyHours}
                              onChange={(e) => handleSubjectChange(index, 'studyHours', e.target.value)}
                              isInvalid={!!errors[`subject${index}StudyHours`]}
                              placeholder="0-10"
                              style={{
                                backgroundColor: "#f5f7fa",
                                color: "#1f2933",
                                border: "1px solid #cbd5e1",
                                borderRadius: "6px",
                                transition: "all 0.3s ease"
                              }}
                              onFocus={(e) => {
                                e.target.style.borderColor = "#4f46e5";
                                e.target.style.boxShadow = "0 0 0 2px rgba(79,70,229,0.2)";
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = "#cbd5e1";
                                e.target.style.boxShadow = "none";
                              }}
                            />
                            {errors[`subject${index}StudyHours`] && (
                              <Form.Control.Feedback type="invalid" style={{ fontSize: "12px" }}>
                                {errors[`subject${index}StudyHours`]}
                              </Form.Control.Feedback>
                            )}
                          </td>
                        </tr>
                      ))}

                      {/* Average Row */}
                      {formData.subjects.length > 0 && (
                        <tr style={{ background: "rgba(79, 70, 229, 0.08)", fontWeight: "600" }}>
                          <td style={{ padding: "12px", fontWeight: "bold", color: "#3b82f6" }}>Avg</td>
                          <td style={{ padding: "12px", color: "#1f2933" }}></td>
                          <td style={{ padding: "12px" }}>
                            <Form.Control
                              type="text"
                              value={`${calculateAverages().internal}%`}
                              readOnly
                              style={{
                                backgroundColor: "#e5e7eb",
                                color: "#1f2933",
                                border: "1px solid #cbd5e1",
                                borderRadius: "6px"
                              }}
                            />
                          </td>
                          <td style={{ padding: "12px" }}>
                            <Form.Control
                              type="text"
                              value={`${calculateAverages().assignment}%`}
                              readOnly
                              style={{
                                backgroundColor: "#e5e7eb",
                                color: "#1f2933",
                                border: "1px solid #cbd5e1",
                                borderRadius: "6px"
                              }}
                            />
                          </td>
                          <td style={{ padding: "12px" }}>
                            <Form.Control
                              type="text"
                              value={`${calculateAverages().attendance}%`}
                              readOnly
                              style={{
                                backgroundColor: "#e5e7eb",
                                color: "#1f2933",
                                border: "1px solid #cbd5e1",
                                borderRadius: "6px"
                              }}
                            />
                          </td>
                          <td style={{ padding: "12px" }}>
                            <Form.Control
                              type="text"
                              value={calculateAverages().studyHours}
                              readOnly
                              style={{
                                backgroundColor: "#e5e7eb",
                                color: "#1f2933",
                                border: "1px solid #cbd5e1",
                                borderRadius: "6px"
                              }}
                            />
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </div>

              <div style={{ marginBottom: "20px", color: theme.subText, fontSize: "14px" }}>
                The values marked in the <strong>Average</strong> row are calculated automatically and cannot be edited.
              </div>

              {/* Submit Button */}
              <div style={{ textAlign: "center" }}>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={loading || !isFormValid()}
                  style={{
                    background: "linear-gradient(135deg, #3b82f6, #1e40af)",
                    border: "none",
                    padding: "15px 40px",
                    fontSize: "18px",
                    fontWeight: "600",
                    borderRadius: "30px",
                    color: "#fff",
                    boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.4)",
                    opacity: loading || !isFormValid() ? 0.6 : 1,
                    cursor: loading || !isFormValid() ? "not-allowed" : "pointer"
                  }}
                >
                  {loading ? "Calculating..." : "Calculate Exam Readiness"}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}

export default ExamReadiness;
