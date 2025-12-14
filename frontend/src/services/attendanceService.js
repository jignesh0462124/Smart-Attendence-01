import { supabase } from "../../supabase/supabase.js";

export async function hasAttendanceToday(employeeId, today) {
  const { data } = await supabase
    .from("attendance")
    .select("id")
    .eq("employee_id", employeeId)
    .eq("date", today)
    .single();

  return !!data;
}

export async function saveAttendance(attendance) {
  return await supabase.from("attendance").insert(attendance);
}

export async function getMonthlyAttendance(userId, startDate, endDate) {
  const { data, error } = await supabase
    .from("attendance")
    .select("date, status")
    .eq("user_id", userId)
    .gte("date", startDate)
    .lte("date", endDate);

  if (error) throw error;
  return data || [];
}
