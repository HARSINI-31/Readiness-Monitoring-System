import React from "react";
import { Routes, Route } from "react-router-dom";

import { UserProvider } from "./context/UserContext";
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

function App() {
  return (
    <UserProvider>
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

        {/* Admin Page */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
