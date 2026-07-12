import { DateTime } from "luxon";

const DEFAULT_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function isToday(date) {
  if (!date) return false;

  const normalizedDate = typeof date === "string" ? date : date.toISOString();
  const dueDate = DateTime.fromISO(normalizedDate, { zone: DEFAULT_TIMEZONE });

  const now = DateTime.now().setZone(DEFAULT_TIMEZONE);
  const start = now.startOf("day");
  const end = start.plus({ days: 1 });

  return start <= dueDate && dueDate < end;
}

export function isUpcoming(date) {
  if (!date) return false;

  const normalizedDate = typeof date === "string" ? date : date.toISOString();
  const dueDate = DateTime.fromISO(normalizedDate, { zone: DEFAULT_TIMEZONE });

  const now = DateTime.now().setZone(DEFAULT_TIMEZONE);
  const todayStart = now.startOf("day");
  const upcomingEnd =
    now.weekday === 7 ? now.plus({ days: 1 }).endOf("day") : now.endOf("week");

  return todayStart <= dueDate && dueDate <= upcomingEnd;
}

export function getTaskDateBuckets(zone = DEFAULT_TIMEZONE) {
  const now = DateTime.now().setZone(zone);

  const todayStart = now.startOf("day");
  const tomorrowStart = todayStart.plus({ days: 1 });
  const dayAfterTomorrowStart = tomorrowStart.plus({ days: 1 });
  const nextWeekStart = now.startOf("week").plus({ weeks: 1 });
  const weekEnd = now.endOf("week");

  const isWeekend = now.weekday === 6 || now.weekday === 7;

  return {
    today: {
      start: todayStart.toUTC().toJSDate(),
      end: tomorrowStart.toUTC().toJSDate(),
    },
    tomorrow: {
      start: tomorrowStart.toUTC().toJSDate(),
      end: dayAfterTomorrowStart.toUTC().toJSDate(),
    },
    thisWeek: {
      start: isWeekend
        ? weekEnd.toUTC().toJSDate()
        : dayAfterTomorrowStart.toUTC().toJSDate(),
      end: nextWeekStart.toUTC().toJSDate(),
    },
  };
}

export function getDueDateOnCreate(activeView) {
  const now = DateTime.now().setZone(DEFAULT_TIMEZONE);
  const dueToday = now.endOf("day");
  const dueTom = dueToday.plus({ days: 1 });
  const dueDayAfterTomorrow = dueTom.plus({ days: 1 });
  const latestDueThisWeek = now.endOf("week");

  let dueDate = dueToday;

  if (activeView.type !== "today" && activeView.type !== "upcoming")
    return null;

  switch (activeView.id) {
    case "tomorrow":
      dueDate = dueTom;
      break;
    case "thisWeek":
      if (dueDayAfterTomorrow <= latestDueThisWeek) {
        dueDate = dueDayAfterTomorrow;
      } else if (dueTom <= latestDueThisWeek) {
        dueDate = dueTom;
      }
      break;
  }

  return dueDate.toISO();
}
