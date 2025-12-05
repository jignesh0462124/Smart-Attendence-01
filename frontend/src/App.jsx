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

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="signup" element={<Signup />} />
        <Route path="employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="admin-dashboard" element={<AdminDashboard />} />
        <Route path="manager-dashboard" element={<ManagerDashboard />} />
        <Route path="admin-profile" element={<AdminProfile />} />
        <Route path="all-employees" element={<AllEmployee />} />
        <Route path="leave-request" element={<LeaveRequest />} />
        <Route path="reportsandanalytics" element={<ReportAndAnalysis />} />
        <Route path="calendar" element={<CompanyCalendar />} />
        <Route path="attendance-history" element={<AttendanceHistory />} />
        <Route path="leave" element={<EmployeeLeave />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="id-creation" element={<IdCreation />} />
        <Route path="tasks" element={<Task />} />
        <Route path="send-notification" element={<SendNotification />} />
        <Route path="manual-attendance" element={<ManualAttendance />} />
        <Route path="manager-attendance-history" element={<MyAttendanceHistory />} />
        <Route path="leave-approvel" element={<LeaveRequestAndApprovel />} />
        <Route path="manager-calendar" element={<ManagerCalendar />} />
        <Route path="manager-profile" element={<ManagerProfile />} />
        <Route path="view-employee" element={<ViewEmployee />} />
        <Route path="aprove-entries" element={<ApproveEntries />} />
        <Route path="settings" element={<SystemSetting />} />
        <Route path="notification" element={<Notification />} />
      </Routes>
    </Router>
  );
};

export default App;
