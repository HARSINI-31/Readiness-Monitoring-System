import React from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

import { UserProvider, useUser } from "./context/UserContext";
import { ThemeProvider } from "./context/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentProfile from "./pages/StudentProfile";
import ReadinessSelect from "./pages/ReadinessSelect";
import ExamReadiness from "./pages/ExamReadiness";
import PlacementReadiness from "./pages/PlacementReadiness";
import Result from "./pages/Result";
import Admin from "./pages/Admin";
import ExamResult from "./pages/ExamResults";
import MyResults from "./pages/MyResults";
import ProgressAnalytics from "./pages/ProgressAnalytics";
import Resources from "./pages/Resources";
import Contact from "./pages/Contact";

function RequireAdminAuth({ children }) {
  const { user } = useUser();
  const location = useLocation();

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

function InitialLoadRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    // Only redirect if we are not on the landing page on initial app mount (refresh)
    if (location.pathname !== "/") {
      navigate("/", { replace: true });
    }
  }, []); // Run only once on mount

  return null;
}

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <InitialLoadRedirect />
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Authentication Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/student-profile" element={<StudentProfile />} />

          {/* Student Pages */}
          <Route path="/readiness" element={<ReadinessSelect />} />
          <Route path="/exam-readiness" element={<ExamReadiness />} />
          <Route path="/placement-readiness" element={<PlacementReadiness />} />
          <Route path="/result" element={<Result />} />
          <Route path="/exam-results" element={<ExamResult />} />
          <Route path="/my-results" element={<MyResults />} />
          <Route path="/progress-analytics" element={<ProgressAnalytics />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/contact" element={<Contact />} />

          <Route
            path="/admin"
            element={
              <RequireAdminAuth>
                <Navigate to="/admin/dashboard" replace />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <RequireAdminAuth>
                <Admin />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/admin/:tab"
            element={
              <RequireAdminAuth>
                <Admin />
              </RequireAdminAuth>
            }
          />

          {/* Fallback redirects */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
