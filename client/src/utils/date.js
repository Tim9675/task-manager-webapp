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
  // Currently filters whole week; intended filter: today, tomorrow, remaining days of the week
  const todayStart = now.startOf("day");
  const nextWeekStart = now.startOf("week").plus({ weeks: 1 });

  return todayStart <= date && date < nextWeekStart;
}

export function getTaskDateBuckets(zone) {
  const now = DateTime.now().setZone(zone);

  const todayStart = now.startOf("day");
  const tomorrowStart = todayStart.plus({ days: 1 });
  const dayAfterTomorrow = tomorrowStart.plus({ days: 1 });
  const weekStart = now.startOf("week"); // Monday (Luxon ISO default)
  const nextWeekStart = weekStart.plus({ weeks: 1 });

  return {
    today: {
      start: todayStart.toUTC().toJSDate(),
      end: tomorrowStart.toUTC().toJSDate(),
    },
    tomorrow: {
      start: tomorrowStart.toUTC().toJSDate(),
      end: dayAfterTomorrow.toUTC().toJSDate(),
    },
    thisWeek: {
      start: dayAfterTomorrow.toUTC().toJSDate(),
      end: nextWeekStart.toUTC().toJSDate(),
    },
  };
}
