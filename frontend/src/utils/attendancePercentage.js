export function isWeekday(date) {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

export function getWorkingDaysInMonth(year, month) {
  let count = 0;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    if (isWeekday(date)) count++;
  }

  return count;
}

export function calculateAttendancePercentage(records, year, month) {
  const workingDays = getWorkingDaysInMonth(year, month);

  const attendedDays = records.filter((r) => {
    const date = new Date(r.date);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month &&
      (r.status === "Present" || r.status === "Late")
    );
  }).length;

  if (workingDays === 0) return "0";

  return ((attendedDays / workingDays) * 100).toFixed(1);
}
