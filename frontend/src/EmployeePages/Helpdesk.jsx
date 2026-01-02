// src/EmployeePages/Helpdesk.jsx
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Send,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  MessageSquare,
  FileText,
  LifeBuoy
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
    { value: "Attendance", label: "Attendance Issue", icon: FileText, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { value: "Leave", label: "Leave Request", icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
    { value: "Technical", label: "Technical Issue", icon: LifeBuoy, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/30" },
    { value: "Other", label: "Other Inquiry", icon: HelpCircle, color: "text-gray-500", bg: "bg-gray-100 dark:bg-gray-700" },
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
      // Simulation of API call
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
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-extrabold tracking-tight ${darkMode ? "text-white" : "text-gray-900"}`}>
            Support Center
          </h1>
          <p className={`mt-2 text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            We're here to help! Search for answers or submit a ticket.
          </p>
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-semibold border flex items-center gap-2 ${darkMode ? "bg-gray-800 border-gray-700 text-green-400" : "bg-white border-gray-200 text-green-600"}`}>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          Support Online
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Ticket Form */}
        <div className="lg:col-span-2">
          <div className={`rounded-2xl shadow-xl border overflow-hidden transition-all duration-300 ${darkMode ? "bg-gray-800 border-gray-700 shadow-gray-900/50" : "bg-white border-gray-100 shadow-slate-200/50"}`}>
            <div className={`p-6 md:p-8 border-b ${darkMode ? "border-gray-700 bg-gray-800/50" : "border-gray-50 bg-gray-50/50"}`}>
              <h2 className={`text-xl font-bold flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                <Send className={`w-5 h-5 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
                Submit a Request
              </h2>
            </div>

            <div className="p-6 md:p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-10 text-center space-y-4 animate-scale-in">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${darkMode ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-600"}`}>
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Request Received!</h3>
                  <p className={`max-w-md ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Your ticket has been successfully submitted. We've sent a confirmation email to your inbox.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Submit Another Ticket
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Subject */}
                  <div className="space-y-2">
                    <label htmlFor="subject" className={`text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Briefly describe the issue..."
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white"}`}
                      disabled={loading}
                    />
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-2">
                    <label className={`text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Category
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {categories.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = formData.category === cat.value;
                        return (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                            className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-3 group ${isSelected
                              ? `border-indigo-500 ring-1 ring-indigo-500 transform scale-[1.02] ${darkMode ? "bg-indigo-900/20" : "bg-indigo-50"}`
                              : `border-transparent ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-50 hover:bg-gray-100"}`
                              }`}
                          >
                            <div className={`p-2 rounded-lg ${cat.bg} ${cat.color}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <div className={`font-semibold ${darkMode ? "text-gray-200" : "text-gray-900"}`}>{cat.label}</div>
                              {isSelected && <div className={`text-xs mt-0.5 font-medium ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}>Selected</div>}
                            </div>
                            {isSelected && (
                              <div className="absolute top-3 right-3">
                                <CheckCircle className="w-4 h-4 text-indigo-500" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label htmlFor="description" className={`text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="6"
                      placeholder="Please provide specific details..."
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white"}`}
                      disabled={loading}
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transform transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${loading
                        ? "bg-indigo-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30"}`}
                    >
                      {loading ? (
                        <>Processing...</>
                      ) : (
                        <>
                          Submit Ticket <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Info & FAQs */}
        <div className="space-y-6">
          {/* Support Info Card */}
          <div className={`rounded-2xl p-6 border shadow-lg ${darkMode ? "bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-800" : "bg-gradient-to-br from-indigo-50 to-white border-indigo-100"}`}>
            <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? "text-white" : "text-indigo-900"}`}>
              <AlertCircle className="w-5 h-5 text-indigo-500" />
              Direct Support
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${darkMode ? "bg-gray-800 text-indigo-400" : "bg-white text-indigo-600 shadow-sm"}`}>
                  <LifeBuoy className="w-4 h-4" />
                </div>
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Helpline</p>
                  <p className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>+1 (800) 123-4567</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${darkMode ? "bg-gray-800 text-indigo-400" : "bg-white text-indigo-600 shadow-sm"}`}>
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Email</p>
                  <p className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>help@smartattend.com</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Quick Links / FAQs */}
          <div className={`rounded-2xl shadow-sm border overflow-hidden ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
            <div className={`p-4 border-b ${darkMode ? "border-gray-700" : "border-gray-50"}`}>
              <h3 className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Common Questions</h3>
            </div>
            <div className="p-2">
              {[
                "How do I correct my attendance?",
                "My leave balance is incorrect",
                "App is not detecting location",
                "How to reset password?"
              ].map((q, i) => (
                <a
                  key={i}
                  href="#"
                  className={`block px-4 py-3 text-sm rounded-lg transition-colors flex items-center justify-between group ${darkMode ? "text-gray-400 hover:bg-gray-700 hover:text-white" : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"}`}
                >
                  {q}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Helpdesk;
