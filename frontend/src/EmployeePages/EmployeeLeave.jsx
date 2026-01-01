// src/EmployeePages/EmployeeLeave.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  FileText,
  Send,
  AlertCircle
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { useUserProfile } from "../context/UserProfileContext";
import { applyLeave, getMyLeaves } from "../services/leavesService";

const LEAVE_QUOTAS = {
  "Annual Leave": 15,
  "Sick Leave": 10,
  "Casual Leave": 5,
  "Unpaid Leave": 0
};

export default function EmployeeLeave() {
  const { userProfile } = useUserProfile();
  const { darkMode } = useOutletContext();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    leave_type: "Annual Leave",
    duration: "Full Day",
    start_date: "",
    end_date: "",
    reason: ""
  });

  useEffect(() => {
    if (userProfile) {
      loadLeaves();
    }
  }, [userProfile]);

  async function loadLeaves() {
    try {
      setLoading(true);
      const data = await getMyLeaves(userProfile.id);
      setLeaves(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load leave history.");
    } finally {
      setLoading(false);
    }
  }

  const balances = useMemo(() => {
    const used = {
      "Annual Leave": 0,
      "Sick Leave": 0,
      "Casual Leave": 0,
      "Unpaid Leave": 0
    };

    leaves.forEach(l => {
      if (l.status === 'Approved') {
        const start = new Date(l.start_date);
        const end = new Date(l.end_date);
        let days = (end - start) / (1000 * 60 * 60 * 24) + 1;

        if (l.duration === 'Half Day') {
          days = 0.5;
        }

        if (used[l.leave_type] !== undefined) {
          used[l.leave_type] += days;
        }
      }
    });

    return [
      {
        type: "Annual Leave",
        used: used["Annual Leave"],
        total: LEAVE_QUOTAS["Annual Leave"],
        bgColor: "bg-blue-500",
        textColor: "text-white",
      },
      {
        type: "Sick Leave",
        used: used["Sick Leave"],
        total: LEAVE_QUOTAS["Sick Leave"],
        bgColor: darkMode ? "bg-gray-700" : "bg-white",
        textColor: darkMode ? "text-white" : "text-gray-900",
      },
      {
        type: "Casual Leave",
        used: used["Casual Leave"],
        total: LEAVE_QUOTAS["Casual Leave"],
        bgColor: darkMode ? "bg-gray-700" : "bg-white",
        textColor: darkMode ? "text-white" : "text-gray-900",
      },
    ];
  }, [leaves, darkMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDurationChange = (type) => {
    setFormData(prev => ({
      ...prev,
      duration: type,
      end_date: type === 'Half Day' ? prev.start_date : prev.end_date
    }));
  };

  const handleSubmit = async () => {
    setError("");
    setSuccessMsg("");

    if (!formData.start_date || !formData.end_date || !formData.reason) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.duration === 'Half Day' && formData.start_date !== formData.end_date) {
      setError("For Half Day leave, Start Date and End Date must be the same.");
      return;
    }

    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      setError("End Date cannot be before Start Date.");
      return;
    }

    try {
      setSubmitting(true);
      await applyLeave({
        user_id: userProfile.id,
        ...formData
      });
      setSuccessMsg("Leave application submitted successfully!");
      setFormData({
        leave_type: "Annual Leave",
        duration: "Full Day",
        start_date: "",
        end_date: "",
        reason: ""
      });
      loadLeaves();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
  };

  const getDotStyle = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-400';
      case 'Rejected': return 'bg-red-400';
      default: return 'bg-yellow-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
            Leave Management
          </h2>
          <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Manage your leaves and view history.
          </p>
        </div>
      </div>

      {/* Leave Balance Cards */}
      <div className="flex flex-col md:flex-row gap-4">
        {balances.map((leave, index) => (
          <div
            key={index}
            className={`${leave.bgColor} rounded-xl p-6 shadow-sm ${index > 0 && !darkMode ? "border border-gray-200" : darkMode && index > 0 ? "border border-gray-700" : ""
              } flex-1`}
          >
            <p
              className={`text-sm font-medium mb-3 ${leave.textColor} opacity-90`}
            >
              {leave.type}
            </p>
            <div className="flex items-baseline space-x-1">
              <h3 className={`text-4xl font-bold ${leave.textColor}`}>
                {leave.used}
              </h3>
              <span
                className={`text-xl ${leave.textColor} opacity-60`}
              >{`/ ${leave.total}`}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Apply for Leave Form */}
        <div className={`lg:col-span-2 rounded-xl shadow-sm border p-6 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mr-3">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              Apply for Leave
            </h3>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {successMsg}
            </div>
          )}

          <div className="space-y-5">
            {/* Leave Type and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Leave Type
                </label>
                <select
                  name="leave_type"
                  value={formData.leave_type}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                >
                  <option>Annual Leave</option>
                  <option>Sick Leave</option>
                  <option>Casual Leave</option>
                  <option>Unpaid Leave</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Duration
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDurationChange("Full Day")}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${formData.duration === "Full Day"
                      ? "bg-indigo-600 text-white"
                      : darkMode ? "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600" : "bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    Full Day
                  </button>
                  <button
                    onClick={() => handleDurationChange("Half Day")}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${formData.duration === "Half Day"
                      ? "bg-indigo-600 text-white"
                      : darkMode ? "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600" : "bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    Half Day
                  </button>
                </div>
              </div>
            </div>

            {/* Start Date and End Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Start Date
                </label>
                <input
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300 text-gray-900"}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  End Date
                </label>
                <input
                  name="end_date"
                  type="date"
                  value={formData.end_date}
                  readOnly={formData.duration === 'Half Day'}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300 text-gray-900"} ${formData.duration === 'Half Day' ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Reason
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                placeholder="Describe the reason..."
                rows={3}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "border-gray-300 text-gray-900 placeholder-gray-400"}`}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setFormData({ ...formData, reason: "", start_date: "", end_date: "" })}
                className={`px-5 py-2.5 font-medium rounded-lg transition-colors text-sm ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"}`}
              >
                Reset
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={`px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center space-x-2 text-sm ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {submitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Application</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Recent Requests */}
        <div className={`rounded-xl shadow-sm border p-6 flex flex-col h-full ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              Leave History
            </h3>
          </div>

          <div className="space-y-5 overflow-y-auto max-h-[500px] pr-2">
            {leaves.length === 0 ? (
              <p className={`text-sm italic ${darkMode ? "text-gray-500" : "text-gray-500"}`}>No leave history found.</p>
            ) : (
              leaves.map((request) => (
                <div key={request.id} className={`flex items-start space-x-3 pb-3 border-b last:border-0 last:pb-0 ${darkMode ? "border-gray-700" : "border-gray-50"}`}>
                  <div
                    className={`w-2.5 h-2.5 ${getDotStyle(request.status)} rounded-full mt-1.5 flex-shrink-0`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className={`font-semibold text-sm ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                        {request.leave_type}
                      </h4>
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-bold rounded uppercase tracking-wide whitespace-nowrap ${getStatusStyle(request.status)}`}
                      >
                        {request.status}
                      </span>
                    </div>
                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {new Date(request.start_date).toLocaleDateString()}
                      {request.start_date !== request.end_date && ` - ${new Date(request.end_date).toLocaleDateString()}`}
                      {' '}
                      <span className="text-indigo-600 font-medium">({request.duration === 'Half Day' ? '0.5' : (
                        (new Date(request.end_date) - new Date(request.start_date)) / (1000 * 60 * 60 * 24) + 1
                      )} Day)</span>
                    </p>
                    {request.rejection_reason && (
                      <p className="text-xs text-red-500 mt-1">Reason: {request.rejection_reason}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
