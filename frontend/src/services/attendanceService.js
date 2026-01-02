import { supabase } from "../../supabase/supabase.js";

const ATTENDANCE_BUCKET = "attendance-photos";

// Legacy-friendly clock-in with strict time window (9:00 AM - 10:30 AM)
export async function clockIn(userId, photoUrl = "", latitude = null, longitude = null) {
  try {
    const today = getLocalDate();

    // Prevent duplicate attendance for the same day
    const existing = await getTodayAttendance(userId);
    if (existing) {
      throw new Error("You have already marked attendance today.");
    }

    // Block Sundays
    const now = new Date();
    const dayOfWeek = now.getDay();
    if (dayOfWeek === 0) {
      throw new Error("Attendance cannot be marked on Sundays.");
    }

    // TIME VALIDATION: 9:00 AM to 10:30 AM
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // 9:00 AM = 540 minutes, 10:30 AM = 630 minutes
    const startTime = 9 * 60;
    const endTime = 10 * 60 + 30;

    if (currentTimeInMinutes < startTime) {
      throw new Error("Clock-in is only allowed between 9:00 AM and 10:30 AM. You are too early.");
    }

    // STRICT: Determine Late Status or Block?
    // User asked "check in work between 9.00 am to 10.30 am"
    // We will block if after 10:30 AM.
    if (currentTimeInMinutes > endTime) {
      throw new Error("Clock-in time has passed (Allowed: 9:00 AM - 10:30 AM). Please contact Admin.");
    }

    // Status: Late logic if after 9:30 AM (570 minutes)
    const lateThreshold = 9 * 60 + 30;
    const status = currentTimeInMinutes > lateThreshold ? "Late" : "Present";

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

// Legacy-friendly clock-out with strict time window (4:30 PM - 5:30 PM)
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

    // TIME VALIDATION: 4:30 PM to 5:30 PM
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // 16:30 (4:30 PM) = 990 minutes, 17:30 (5:30 PM) = 1050 minutes
    const startTime = 16 * 60 + 30;
    const endTime = 17 * 60 + 30;

    /* 
       NOTE: Development Bypass - strict time windows make testing impossible if dev is outside hours.
       We should add a bypass or clear error. For production, strict logic applies.
    */
    if (currentTimeInMinutes < startTime) {
      throw new Error("Clock-out is only allowed between 4:30 PM and 5:30 PM.");
    }

    if (currentTimeInMinutes > endTime) {
      // Maybe allow late clock out but warn? Or strict? 
      // "check out work after the 4.30 to 5.30 pm in between" implies strictly between.
      throw new Error("Clock-out time has passed (Allowed: 4:30 PM - 5:30 PM).");
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

