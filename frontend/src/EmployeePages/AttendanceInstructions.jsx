import React from "react";
import { Clock, AlertTriangle, MapPin, Smartphone, CalendarX, ArrowLeft } from "lucide-react";

export default function AttendanceInstructions() {
    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-900">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 transition-colors font-semibold"
                >
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>

                <header className="mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-slate-900">Attendance Guidelines</h1>
                    <p className="text-lg text-slate-600">Please review the following rules to ensuring your attendance is marked correctly and timely.</p>
                </header>

                <div className="grid gap-8">

                    {/* Time Rules Section */}
                    <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <Clock className="text-blue-600" /> Time Windows
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                                <span className="block text-sm font-bold text-blue-800 uppercase tracking-wider mb-1">Morning Check-In</span>
                                <div className="text-3xl font-black text-blue-900">09:00 AM</div>
                                <div className="text-sm text-blue-700 font-medium mt-1">to 10:30 AM</div>
                                <p className="mt-3 text-sm text-blue-800/80 leading-relaxed">
                                    Strict check-in window. System allows entry only during this time.
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100">
                                <span className="block text-sm font-bold text-indigo-800 uppercase tracking-wider mb-1">Evening Check-Out</span>
                                <div className="text-3xl font-black text-indigo-900">04:30 PM</div>
                                <div className="text-sm text-indigo-700 font-medium mt-1">to 05:30 PM</div>
                                <p className="mt-3 text-sm text-indigo-800/80 leading-relaxed">
                                    Mark your exit during this hour to complete your daily log.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Exceptions & Rules */}
                    <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <AlertTriangle className="text-amber-500" /> Exceptions & Policies
                        </h2>
                        <ul className="space-y-4">
                            <li className="flex gap-4 items-start">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm">1</div>
                                <div>
                                    <h3 className="font-bold text-slate-900">Late Marking</h3>
                                    <p className="text-slate-600 leading-relaxed">Checking in after <span className="font-bold text-amber-600">09:30 AM</span> will automatically mark your status as <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-700">Late</span>.</p>
                                </div>
                            </li>
                            <li className="flex gap-4 items-start">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm">2</div>
                                <div>
                                    <h3 className="font-bold text-slate-900">Sunday Policy</h3>
                                    <div className="flex items-center gap-2 mt-1 text-slate-600">
                                        <CalendarX size={16} className="text-red-500" />
                                        <span>Attendance marking is <strong>disabled</strong> on Sundays.</span>
                                    </div>
                                </div>
                            </li>
                            <li className="flex gap-4 items-start">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">3</div>
                                <div>
                                    <h3 className="font-bold text-slate-900">Missed Clock-outs</h3>
                                    <p className="text-slate-600 leading-relaxed">If you forget to clock out, please contact HR/Admin to rectify your record. Repeated offenses may affect attendance scores.</p>
                                </div>
                            </li>
                        </ul>
                    </section>

                    {/* How It Works Check */}
                    <section className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl">
                        <h2 className="text-2xl font-bold mb-6">Verification Process</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="flex gap-4">
                                <div className="p-3 bg-white/10 rounded-xl h-fit">
                                    <MapPin size={24} className="text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Geofencing</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        You must be physically present within the office premises (100m radius) for the system to unlock the check-in button. Ensure GPS is enabled.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="p-3 bg-white/10 rounded-xl h-fit">
                                    <Smartphone size={24} className="text-emerald-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Face Recognition</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        The app uses your camera to verify your identity. Ensure good lighting and remove masks/sunglasses during scanning.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
