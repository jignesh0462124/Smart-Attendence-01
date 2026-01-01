import { supabase } from "../../supabase/supabase.js";

const ATTENDANCE_BUCKET = "attendance-photos";

// Legacy-friendly clock-in to support existing UI flows
export async function clockIn(userId, photoUrl = "", latitude = null, longitude = null) {
  try {
    const today = getLocalDate();

    // Prevent duplicate attendance for the same day
    const existing = await getTodayAttendance(userId);
    if (existing) {
      throw new Error("You have already marked attendance today.");
    }

    // Block Sundays
    const dayOfWeek = new Date().getDay();
    if (dayOfWeek === 0) {
      throw new Error("Attendance cannot be marked on Sundays.");
    }

    // Determine status based on time (Late after 9:30 AM)
    const now = new Date();
    const status = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 30)
      ? "Late"
      : "Present";

    const payload = {
      user_id: userId,
      date: today,
      status,
      check_in: now.toISOString(),
      photo_url: photoUrl || null,
      latitude,
      longitude,
    };

    const { data, error } = await supabase
      .from("attendance")
      .insert([payload])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    console.error("Clock-in error:", err);
    throw err;
  }
}

// Legacy-friendly clock-out to support existing UI flows
export async function clockOut(userId) {
  try {
    const today = getLocalDate();
    const { data: existing, error: fetchError } = await supabase
      .from("attendance")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw new Error(fetchError.message);
    }

    if (!existing) {
      throw new Error("No attendance record found for today to clock out.");
    }

    if (existing.check_out) {
      return existing; // already clocked out
    }

    const { data, error } = await supabase
      .from("attendance")
      .update({ check_out: new Date().toISOString() })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    console.error("Clock-out error:", err);
    throw err;
  }
}

// Helper to get local date string YYYY-MM-DD
const getLocalDate = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().split("T")[0];
};

/**
 * Upload attendance photo to Supabase Storage
 * @param {string} userId - The user ID
 * @param {Blob} photoBlob - The photo blob from canvas
 * @returns {Promise<string>} Public URL of the uploaded photo
 */
export async function uploadAttendancePhoto(userId, photoBlob) {
  try {
    if (!photoBlob) {
      throw new Error("Photo blob is required");
    }

    // Create file path: userId/timestamp.jpg
    const timestamp = Date.now();
    const fileName = `${userId}/${timestamp}.jpg`;

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from(ATTENDANCE_BUCKET)
      .upload(fileName, photoBlob, {
        cacheControl: "3600",
        upsert: false, // Don't overwrite
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(ATTENDANCE_BUCKET)
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Photo upload error:", error);
    throw error;
  }
}

/**
 * Submit attendance record with photo
 * Face detection validation should be done before calling this
 * @param {Object} attendanceData - Attendance data
 * @returns {Promise<Object>} The inserted attendance record
 */
export async function submitAttendance(attendanceData) {
  try {
    const { user_id, photo_url, latitude = null, longitude = null } = attendanceData;

    // Check if already marked today
    const today = getLocalDate();
    const alreadyMarked = await getTodayAttendance(user_id);

    if (alreadyMarked) {
      throw new Error("You have already marked attendance today.");
    }

    // Check if today is Sunday
    const today_date = new Date();
    const dayOfWeek = today_date.getDay();
    if (dayOfWeek === 0) {
      throw new Error("Attendance cannot be marked on Sundays.");
    }

    // Determine status based on time (Late if after 9:30 AM)
    const hour = today_date.getHours();
    const minute = today_date.getMinutes();
    const status = hour > 9 || (hour === 9 && minute > 30) ? "Late" : "Present";

    // Insert attendance record
    const { data, error } = await supabase
      .from("attendance")
      .insert([
        {
          user_id,
          date: today,
          status,
          check_in: new Date().toISOString(),
          photo_url,
          latitude,
          longitude,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Attendance submission failed: ${error.message}`);
    }

    console.log("✅ Attendance marked successfully:", data);
    return data;
  } catch (error) {
    console.error("Attendance submission error:", error);
    throw error;
  }
}

/**
 * Get today's attendance for a user
 */
export async function getTodayAttendance(userId) {
  const today = getLocalDate();
  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", userId)
    .eq("date", today)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    console.error("Error checking attendance:", error);
  }

  return data;
}

/**
 * Get attendance history with optional filtering
 */
export async function getAttendanceHistory(userId, month = null, year = null) {
  let q = supabase
    .from("attendance")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (month !== null && year !== null) {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;
    q = q.gte("date", startDate).lte("date", endDate);
  }

  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

/**
 * Get attendance statistics for a user
 */
export async function getAttendanceStats(userId, month, year) {
  if (!month || !year) {
    const now = new Date();
    month = now.getMonth() + 1;
    year = now.getFullYear();
  }

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDayVal = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDayVal}`;

  const { data: attendance, error: attError } = await supabase
    .from("attendance")
    .select("status, date")
    .eq("user_id", userId)
    .gte("date", startDate)
    .lte("date", endDate);

  if (attError) throw attError;

  // Count approved leaves
  const { data: approvedLeaves, error: leaveError } = await supabase
    .from("leaves")
    .select("duration")
    .eq("user_id", userId)
    .eq("status", "Approved")
    .gte("start_date", startDate)
    .lte("end_date", endDate);

  if (leaveError) throw leaveError;

  const totalDaysInMonth = lastDayVal;
  let sundays = 0;
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const date = new Date(year, month - 1, d);
    if (date.getDay() === 0) sundays++;
  }

  const presentCount = attendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
  const approvedLeaveDays = approvedLeaves ? approvedLeaves.length : 0;
  const totalWorkingDays = (totalDaysInMonth - sundays) - approvedLeaveDays;

  const percentage = totalWorkingDays > 0
    ? ((presentCount / totalWorkingDays) * 100).toFixed(1)
    : 0;

  const finalPercentage = Math.min(parseFloat(percentage), 100);

  return {
    workingDays: totalWorkingDays,
    presentDays: presentCount,
    leaves: approvedLeaveDays,
    percentage: finalPercentage,
    attendanceHistory: attendance
  };
}

/**
 * Get all attendance records for a specific date
 */
export async function getTodayAllAttendance() {
  const today = getLocalDate();
  const { data, error } = await supabase
    .from("attendance")
    .select(`
      *,
      profiles:user_id (full_name, department, role, employee_id)
    `)
    .eq("date", today);

  if (error) throw error;
  return data;
}

/**
 * Get admin statistics
 */
export async function getAdminStats() {
  const today = getLocalDate();

  try {
    const { count: totalEmployees, error: err1 } = await supabase
      .from("profiles")
      .select("*", { count: 'exact', head: true })
      .eq("role", "employee");

    const { count: presentToday, error: err2 } = await supabase
      .from("attendance")
      .select("*", { count: 'exact', head: true })
      .eq("date", today)
      .in("status", ["Present", "Late"]);

    const { count: onLeaveToday, error: err3 } = await supabase
      .from("leaves")
      .select("*", { count: 'exact', head: true })
      .eq("status", "Approved")
      .lte("start_date", today)
      .gte("end_date", today);

    const { count: pendingLeaves, error: err4 } = await supabase
      .from("leaves")
      .select("*", { count: 'exact', head: true })
      .eq("status", "Pending");

    if (err1 || err2 || err3 || err4) {
      console.error("Stats Error:", err1, err2, err3, err4);
      throw new Error("Failed to fetch admin stats");
    }

    return {
      totalEmployees: totalEmployees || 0,
      presentToday: presentToday || 0,
      onLeaveToday: onLeaveToday || 0,
      pendingLeaves: pendingLeaves || 0,
    };
  } catch (error) {
    console.error("Admin stats error:", error);
    throw error;
  }
}
