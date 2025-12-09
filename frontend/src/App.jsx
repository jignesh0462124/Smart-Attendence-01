// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./Landing/Landing";
import Signup from "./Authentication/Signup";
import EmployeeDashboard from "./Dashboard/EmployeeDashboard";
import AdminDashboard from "./Dashboard/AdminDashboard";
import ManagerDashboard from "./Dashboard/ManagerDashboard";
import AdminProfile from "./AdminPages/AdminProfile";
import AllEmployee from "./AdminPages/AllEmployee";
import LeaveRequest from "./AdminPages/LeaveRequest";
import ReportAndAnalysis from "./AdminPages/ReportAndAnalysis";
import AttendanceHistory from "./EmployeePages/AttendanceHistory";
import EmployeeLeave from "./EmployeePages/EmployeeLeave";
import ProfilePage from "./EmployeePages/ProfilePage";
import IdCreation from "./ManagerPages/IdCreation";
import ManagerCalendar from "./ManagerPages/ManagerCalendar";
import ManagerProfile from "./ManagerPages/ManagerProfile";
import ViewEmployee from "./ManagerPages/ViewEmployee";
import ApproveEntries from "./AdminPages/AproveEntries";
import SystemSetting from "./AdminPages/SystemSetting";
import Notification from "./Notification/Notification";
import CompanyCalendar from "./Calender/CompanyCalendar";
import Task from "./ManagerPages/Task";
import SendNotification from "./ManagerPages/SendNotification";
import ManualAttendance from "./ManagerPages/Manualattendance";
import LeaveRequestAndApprovel from "./ManagerPages/LeaveRequestAndApprovel";
import MyAttendanceHistory from "./ManagerPages/ManagerAttendanceHistory";
import AdminLogin from "./AdminPages/AdminLogin";
import SuperLogin from "./SuperAdmin/SuperLogin.jsx";
import SuperDashboard from "./SuperAdmin/SuperDashboard.jsx";

// 🔒 import your auth guard hook (change path if needed)
import { useAuthGuard } from "./Authentication/useAuthGuard.jsx";

// 🔒 simple wrapper component to protect routes
const ProtectedRoute = ({ children, redirectTo = "/admin-login" }) => {
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
        <Route path="admin-login" element={<AdminLogin />} />
        <Route path="super-login" element={<SuperLogin />} />

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

        {/* Protected: Admin */}
        <Route
          path="admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin-profile"
          element={
            <ProtectedRoute>
              <AdminProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="all-employees"
          element={
            <ProtectedRoute>
              <AllEmployee />
            </ProtectedRoute>
          }
        />
        <Route
          path="leave-request"
          element={
            <ProtectedRoute>
              <LeaveRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="reportsandanalytics"
          element={
            <ProtectedRoute>
              <ReportAndAnalysis />
            </ProtectedRoute>
          }
        />
        <Route
          path="aprove-entries"
          element={
            <ProtectedRoute>
              <ApproveEntries />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute>
              <SystemSetting />
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

        {/* Protected: Manager */}
        <Route
          path="manager-dashboard"
          element={
            <ProtectedRoute>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="id-creation"
          element={
            <ProtectedRoute>
              <IdCreation />
            </ProtectedRoute>
          }
        />
        <Route
          path="tasks"
          element={
            <ProtectedRoute>
              <Task />
            </ProtectedRoute>
          }
        />
        <Route
          path="send-notification"
          element={
            <ProtectedRoute>
              <SendNotification />
            </ProtectedRoute>
          }
        />
        <Route
          path="manual-attendance"
          element={
            <ProtectedRoute>
              <ManualAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="manager-attendance-history"
          element={
            <ProtectedRoute>
              <MyAttendanceHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="leave-approvel"
          element={
            <ProtectedRoute>
              <LeaveRequestAndApprovel />
            </ProtectedRoute>
          }
        />
        <Route
          path="manager-calendar"
          element={
            <ProtectedRoute>
              <ManagerCalendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="manager-profile"
          element={
            <ProtectedRoute>
              <ManagerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="view-employee"
          element={
            <ProtectedRoute>
              <ViewEmployee />
            </ProtectedRoute>
          }
        />

        {/* Protected: Super Admin */}
        <Route
          path="super-dashboard"
          element={
            <ProtectedRoute redirectTo="/super-login">
              <SuperDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
