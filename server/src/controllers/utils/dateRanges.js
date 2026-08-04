import { DateTime } from "luxon";

export function getTodayRange(zone) {
  const now = DateTime.now().setZone(zone);

  const start = now.startOf("day");
  const end = start.plus({ days: 1 }); // DOC: exclusive end

  return {
    start: start.toUTC().toJSDate(),
    end: end.toUTC().toJSDate(),
  };
}

export function getTaskDateBuckets(zone) {
  const now = DateTime.now().setZone(zone);

  const todayStart = now.startOf("day");
  const tomorrowStart = todayStart.plus({ days: 1 });
  const dayAfterTomorrow = tomorrowStart.plus({ days: 1 });
  const weekStart = now.startOf("week"); // DOC: Monday (Luxon ISO default)
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
