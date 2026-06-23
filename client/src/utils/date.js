import { DateTime } from "luxon";

const DEFAULT_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function isToday(date) {
  if (!date) return false;
  const normalizedDate = typeof date === "string" ? date : date.toISOString();
  const dueDate = DateTime.fromISO(normalizedDate);

  const now = DateTime.now().setZone(DEFAULT_TIMEZONE);

  const start = now.startOf("day");
  const end = start.plus({ days: 1 }); // exclusive end

  return start <= dueDate && dueDate < end;
}

export function isUpcoming(date) {
  if (!date) return false;
  const normalizedDate = typeof date === "string" ? date : date.toISOString();
  const dueDate = DateTime.fromISO(normalizedDate);
  const now = DateTime.now().setZone(DEFAULT_TIMEZONE);
  // Currently filters whole week; intended filter: today, tomorrow, remaining days of the week
  const todayStart = now.startOf("day");
  const nextWeekStart = now.startOf("week").plus({ weeks: 1 });

  return todayStart <= dueDate && dueDate < nextWeekStart;
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

export function getDueDateOnCreate(activeView) {
  const now = DateTime.now().setZone(DEFAULT_TIMEZONE);
  DEFAULT_TIMEZONE;
  const dueToday = now.endOf("day");
  const dueTom = dueToday.plus({ days: 1 });
  const dayAfterTomorrow = dueTom.plus({ days: 1 });
  const latestDueThisWeek = now.endOf("week");

  let dueDate = dueToday;

  switch (activeView.id) {
    case "tomorrow":
      dueDate = dueTom;
      break;
    case "thisWeek":
      if (dayAfterTomorrow <= latestDueThisWeek) {
        dueDate = dayAfterTomorrow;
      } else if (dueTom <= latestDueThisWeek) {
        dueDate = dueTom;
      }
  }

  return dueDate.toISO();
}
