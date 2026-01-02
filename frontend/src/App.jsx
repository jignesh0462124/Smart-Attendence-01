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
  const [showTimeout, setShowTimeout] = React.useState(false);

  React.useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => setShowTimeout(true), 8000); // Show help after 8 seconds
    }
    return () => clearTimeout(timer);
  }, [loading]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-gray-600">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-medium animate-pulse">Loading your profile...</p>

        {showTimeout && (
          <div className="mt-8 text-center animate-fade-in">
            <p className="text-sm mb-3 text-red-500">Taking longer than expected?</p>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = '/signup';
              }}
              className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-semibold"
            >
              Force Log Out & Retry
            </button>
            <div className="mt-2 text-xs text-gray-400 max-w-xs mx-auto">
              Note: "Not Secure" warning on localhost is normal. Ensure you are connected to the internet.
            </div>
          </div>
        )}
      </div>
    );
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
