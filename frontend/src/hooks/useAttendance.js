import { markAttendanceLogic } from "../utils/attendanceLogic";
import {
  hasAttendanceToday,
  saveAttendance,
  getMonthlyAttendance
} from "../services/attendanceService";

export function useAttendance() {
  const markAttendance = async (employeeId) => {
    const today = new Date().toISOString().split("T")[0];
    const alreadyMarked = await hasAttendanceToday(employeeId, today);

    const attendance = markAttendanceLogic(employeeId, alreadyMarked);
    await saveAttendance(attendance);

    return attendance;
  };

  const fetchMonthlyAttendance = async (employeeId, year, month) => {
    const start = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const end = new Date(year, month + 1, 0).toISOString().split("T")[0];

    return await getMonthlyAttendance(employeeId, start, end);
  };

  return { markAttendance, fetchMonthlyAttendance };
}
