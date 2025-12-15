// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./Landing/Landing";
import Signup from "./Authentication/Signup";
import EmployeeDashboard from "./Dashboard/EmployeeDashboard";
import AttendanceHistory from "./EmployeePages/AttendanceHistory";
import EmployeeLeave from "./EmployeePages/EmployeeLeave";
import ProfilePage from "./EmployeePages/ProfilePage";
import Notification from "./Notification/Notification";
import CompanyCalendar from "./Calender/CompanyCalendar";

// 🔒 import your auth guard hook (change path if needed)
import { useAuthGuard } from "./Authentication/useAuthGuard.jsx";
// 🔒 simple wrapper component to protect routes
const ProtectedRoute = ({ children, redirectTo = "/Signup" }) => {
  const { user, loading } = useAuthGuard({ redirectTo });

  if (loading) {
    return <div>Checking session...</div>; // you can replace with a loader UI
  }

  // If not logged in, useAuthGuard already redirected, just render nothing
  if (!user) return null;

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="signup" element={<Signup />} />
      
        {/* Protected: Employee */}
        <Route
          path="employee-dashboard"
          element={
            <ProtectedRoute>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="attendance-history"
          element={
            <ProtectedRoute>
              <AttendanceHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="leave"
          element={
            <ProtectedRoute>
              <EmployeeLeave />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        
        <Route
          path="notification"
          element={
            <ProtectedRoute>
              <Notification />
            </ProtectedRoute>
          }
        />
        <Route
          path="calendar"
          element={
            <ProtectedRoute>
              <CompanyCalendar />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
