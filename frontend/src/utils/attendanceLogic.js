export const CHECK_IN_TIME = "09:30";
export const LATE_LIMIT_MINUTES = 10;

export function isWeekday(date = new Date()) {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

export function timeToMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function markAttendanceLogic(employeeId, alreadyMarked) {
  const now = new Date();

  if (!isWeekday(now)) {
    throw new Error("Attendance not allowed on weekends");
  }

  if (alreadyMarked) {
    throw new Error("Attendance already marked");
  }

  const date = now.toISOString().split("T")[0];
  const checkInTime = now.toTimeString().slice(0, 5);

  const checkInMinutes = timeToMinutes(checkInTime);
  const fixedMinutes = timeToMinutes(CHECK_IN_TIME);

  let status = "Absent";

  if (checkInMinutes <= fixedMinutes) status = "Present";
  else if (checkInMinutes <= fixedMinutes + LATE_LIMIT_MINUTES)
    status = "Late";

  return { employeeId, date, checkInTime, status };
}

