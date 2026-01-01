// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./Landing/Landing";
import Signup from "./Authentication/Signup";
import EmployeeDashboard from "./Dashboard/EmployeeDashboard";
import AttendanceHistory from "./EmployeePages/AttendanceHistory";
import EmployeeLeave from "./EmployeePages/EmployeeLeave";
import ProfilePage from "./EmployeePages/ProfilePage";
import Helpdesk from "./EmployeePages/Helpdesk";
import Notification from "./Notification/Notification";
import CompanyCalendar from "./Calender/CompanyCalendar";
import Layout from "./components/Layout";
import { UserProfileProvider, useUserProfile } from "./context/UserProfileContext";

// 🔒 Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { userProfile, loading } = useUserProfile();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!userProfile) {
    return <Navigate to="/signup" replace />;
  }

  return children;
};

const App = () => {
  return (
    <UserProfileProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="signup" element={<Signup />} />

          {/* Employee Routes - Wrapped in Layout */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="employee-dashboard" element={<EmployeeDashboard />} />
            <Route path="attendance-history" element={<AttendanceHistory />} />
            <Route path="leave" element={<EmployeeLeave />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="helpdesk" element={<Helpdesk />} />
            <Route path="notification" element={<Notification />} />
            <Route path="calendar" element={<CompanyCalendar />} />
          </Route>

          {/* Admin Routes Removed - Admin is in a separate project */}

        </Routes>
      </Router>
    </UserProfileProvider>
  );
};

export default App;
