// src/EmployeePages/Helpdesk.jsx
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Send,
  AlertCircle,
  CheckCircle,
  HelpCircle,
} from "lucide-react";

const Helpdesk = () => {
  const { darkMode } = useOutletContext();
  const [formData, setFormData] = useState({
    subject: "",
    category: "Technical",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: "Attendance", label: "Attendance Issue", icon: "📋" },
    { value: "Leave", label: "Leave Request", icon: "📅" },
    { value: "Technical", label: "Technical Issue", icon: "💻" },
    { value: "Other", label: "Other", icon: "❓" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject.trim()) {
      alert("Please enter a subject");
      return;
    }
    if (!formData.description.trim()) {
      alert("Please enter a description");
      return;
    }

    setLoading(true);

    try {
      console.log("🎫 Support Ticket Submitted:", {
        ...formData,
        timestamp: new Date().toISOString(),
        ticketId: `TKT-${Date.now()}`,
      });

      setSubmitted(true);

      setTimeout(() => {
        setFormData({
          subject: "",
          category: "Technical",
          description: "",
        });
        setSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error("Error submitting ticket:", error);
      alert("Failed to submit ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
            Support Center
          </h2>
          <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Have an issue? We're here to help.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className={`rounded-xl shadow-sm border p-6 sm:p-8 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
            <h2 className={`text-xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Raise a Support Ticket
            </h2>

            {submitted && (
              <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${darkMode ? "bg-green-900/30 border border-green-800" : "bg-green-50 border border-green-200"}`}>
                <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${darkMode ? "text-green-400" : "text-green-600"}`} />
                <div>
                  <h3 className={`font-semibold ${darkMode ? "text-green-300" : "text-green-700"}`}>
                    Ticket Submitted Successfully!
                  </h3>
                  <p className={`text-sm mt-1 ${darkMode ? "text-green-400" : "text-green-600"}`}>
                    Our support team will review your request and get back to you within 24 hours.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g., Attendance Mark Issue"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "border-gray-300 text-gray-900"}`}
                  disabled={loading}
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className={`block text-sm font-medium mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          category: cat.value,
                        }))
                      }
                      className={`p-3 rounded-lg border-2 transition-all font-medium text-sm flex items-center gap-2 ${formData.category === cat.value
                        ? `border-indigo-500 ${darkMode ? "bg-indigo-900/30 text-indigo-300" : "bg-indigo-50 text-indigo-700"}`
                        : `border-gray-200 ${darkMode ? "border-gray-600 bg-gray-700 text-gray-300 hover:border-indigo-500" : "bg-white text-gray-700 hover:border-indigo-300"}`
                        }`}
                      disabled={loading}
                    >
                      <span>{cat.icon}</span>
                      <span className="hidden sm:inline">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Please describe your issue in detail..."
                  rows="5"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "border-gray-300 text-gray-900"}`}
                  disabled={loading}
                />
                <p className={`text-xs mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Be as detailed as possible to help us resolve your issue faster.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || submitted}
                className={`w-full py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 ${loading || submitted
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl"
                  }`}
              >
                <Send className="w-5 h-5" />
                {loading ? "Submitting..." : submitted ? "✓ Submitted" : "Submit Ticket"}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Info Card */}
          <div className={`rounded-xl p-6 border ${darkMode ? "bg-indigo-900/20 border-indigo-800" : "bg-indigo-50 border-indigo-200"}`}>
            <h3 className={`font-bold mb-4 flex items-center gap-2 ${darkMode ? "text-indigo-300" : "text-indigo-900"}`}>
              <AlertCircle className="w-5 h-5" />
              Need Help?
            </h3>
            <ul className={`space-y-3 text-sm ${darkMode ? "text-indigo-200" : "text-indigo-800"}`}>
              <li>
                <strong>📞 Call Support:</strong> +91-XXXX-XXXXX
              </li>
              <li>
                <strong>📧 Email:</strong> support@smartattend.com
              </li>
              <li>
                <strong>⏰ Hours:</strong> Mon-Fri, 9 AM - 6 PM
              </li>
            </ul>
          </div>

          {/* FAQ Card */}
          <div className={`rounded-xl p-6 border shadow-sm ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            <h3 className={`font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Common Issues
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                "Attendance not marked",
                "Leave approval pending",
                "Document upload failed",
                "Password reset needed",
              ].map((issue, i) => (
                <li
                  key={i}
                  className={`cursor-pointer transition-colors ${darkMode ? "text-gray-400 hover:text-indigo-400" : "text-gray-600 hover:text-indigo-600"}`}
                >
                  • {issue}
                </li>
              ))}
            </ul>
          </div>

          {/* Status Card */}
          <div className={`rounded-xl p-6 border ${darkMode ? "bg-green-900/20 border-green-800" : "bg-green-50 border-green-200"}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className={`text-sm font-semibold ${darkMode ? "text-green-300" : "text-green-700"}`}>
                System Operational
              </span>
            </div>
            <p className={`text-xs ${darkMode ? "text-green-400" : "text-green-600"}`}>
              All systems running normally. Response time: &lt; 1 hour
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Helpdesk;
