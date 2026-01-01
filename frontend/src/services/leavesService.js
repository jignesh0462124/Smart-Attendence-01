import { supabase } from "../../supabase/supabase.js";

/*
  Leaves Table Schema (Reminder):
  - id, user_id, leave_type, duration, start_date, end_date, reason, status, rejection_reason
*/

export async function applyLeave(leaveData) {
    // Validate Sundays
    const start = new Date(leaveData.start_date);
    const end = new Date(leaveData.end_date);

    // Simple check: start or end cannot be sunday (User requirement: "Prevent applying leave on Sundays")
    // If range is multiple days, usually we just skip sundays in calculation, 
    // but the requirement says "Prevent applying leave on Sundays". 
    // This probably means "Don't let them pick a Sunday as a date".
    if (start.getDay() === 0 || end.getDay() === 0) {
        throw new Error("Leave cannot be applied on Sundays.");
    }

    // Validate Overlap
    const { data: overlaps, error: overlapError } = await supabase
        .from("leaves")
        .select("id")
        .eq("user_id", leaveData.user_id)
        .neq("status", "Rejected") // Ignore rejected
        .or(`start_date.lte.${leaveData.end_date},end_date.gte.${leaveData.start_date}`);
    // Logic: (ExistingStart <= NewEnd) AND (ExistingEnd >= NewStart)

    // Note: Supabase .or() with complex range/filter might need raw filter or careful syntax.
    // Let's use filter approach for safety since .or syntax can be tricky with ANDs inside.
    /*
       A starts before B ends AND A ends after B starts
       start_date <= leaveData.end_date
       end_date >= leaveData.start_date
    */

    if (overlaps && overlaps.length > 0) {
        // Double check in js because .or syntax can be flaky if not perfect
        // Actually, let's trust Supabase if done right.
        // Alternative:
        /*
          .filter('start_date', 'lte', leaveData.end_date)
          .filter('end_date', 'gte', leaveData.start_date)
        */
    }

    // Re-run overlap check explicitly
    const { data: existing } = await supabase
        .from("leaves")
        .select("start_date, end_date")
        .eq("user_id", leaveData.user_id)
        .neq("status", "Rejected");

    if (existing) {
        const isOverlap = existing.some(l => {
            const rangeStart = new Date(l.start_date);
            const rangeEnd = new Date(l.end_date);
            return start <= rangeEnd && end >= rangeStart;
        });
        if (isOverlap) {
            throw new Error("You already have a leave request for these dates.");
        }
    }

    const { data, error } = await supabase.from("leaves").insert([leaveData]).select().single();
    if (error) throw error;
    return data;
}

export async function getMyLeaves(userId) {
    const { data, error } = await supabase
        .from("leaves")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
}

// For Admin
export async function getAllLeaves() {
    // Join with profiles to show names
    const { data, error } = await supabase
        .from("leaves")
        .select("*, profiles(full_name, email, employee_id)")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
}

export async function updateLeaveStatus(leaveId, status, rejectionReason = null) {
    const updateData = { status };
    if (status === 'Rejected' && rejectionReason) {
        updateData.rejection_reason = rejectionReason;
    }

    const { data, error } = await supabase
        .from("leaves")
        .update(updateData)
        .eq("id", leaveId)
        .select()
        .single();

    if (error) throw error;

    // If Approved, do we need to insert something into 'attendance' table?
    // Requirement: "Approved leave auto-reflects in attendance history -> Attendance status changes to Leave"
    // Approach: Either we query leaves in history (as we did in getAttendanceStats) OR we physically insert a record.
    // Physically inserting is safer for historical consistency if leave was cancelled later but we want record etc.
    // But duplicate source of truth is risky.
    // Let's stick to "Attendance History COMPONENT queries leaves table" for better consistency,
    // OR inserting a record into attendance table prevents the user from "Clocking In" on that day.

    // If I insert into Attendance table status='Leave', then 'Clock In' check `getTodayAttendance` will return a record.
    // If it returns a record with status='Leave', does `clockIn` logic block it?
    // `clockIn` checks `if (alreadyMarked) throw ...`.
    // So YES, inserting into attendance prevents clock in. This is GOOD.

    if (status === 'Approved') {
        // Iterate days and insert attendance records
        // This is complex for date ranges.
        // Let's implement this logic:
        const { user_id, start_date, end_date } = data;

        let current = new Date(start_date);
        const end = new Date(end_date);

        while (current <= end) {
            if (current.getDay() !== 0) { // Skip Sundays
                const dateStr = current.toISOString().split("T")[0];

                // Check if exists first to avoid duplicate key error
                const { data: exists } = await supabase
                    .from("attendance")
                    .select("id")
                    .eq("user_id", user_id)
                    .eq("date", dateStr)
                    .single();

                if (!exists) {
                    await supabase.from("attendance").insert({
                        user_id: user_id,
                        date: dateStr,
                        status: 'Leave'
                    });
                }
            }
            current.setDate(current.getDate() + 1);
        }
    }

    return data;
}
