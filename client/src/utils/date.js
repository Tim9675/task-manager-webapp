import { DateTime } from "luxon";

const DEFAULT_TIMEZONE = "Asia/Manila";

export function isToday(date) {
  const now = DateTime.now().setZone(DEFAULT_TIMEZONE);

  const start = now.startOf("day");
  const end = start.plus({ days: 1 }); // exclusive end

  return start.toUTC().toJSDate() <= date && date < end.toUTC().toJSDate();
}

export function isUpcoming(date) {
  const now = DateTime.now().setZone(DEFAULT_TIMEZONE);
  // Currently filters whole week; intended filter:
  const weekStart = now.startOf("week");
  const nextWeekStart = weekStart.plus({ weeks: 1 });

  return weekStart <= date && date < nextWeekStart;
}
