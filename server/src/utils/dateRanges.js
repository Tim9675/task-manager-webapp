import { DateTime } from "luxon";

export function getTodayRange(zone) {
  const now = DateTime.now().setZone(zone);

  const start = now.startOf("day");
  const end = start.plus({ days: 1 }); // exclusive end

  return {
    start: start.toUTC().toJSDate(),
    end: end.toUTC().toJSDate(),
  };
}

export function getTaskDateBuckets(zone) {
  const now = DateTime.now().setZone(zone);

  const todayStart = now.startOf("day");
  const todayEnd = now.endOf("day");

  const tomorrowStart = todayStart.plus({ days: 1 });
  const tomorrowEnd = tomorrowStart.endOf("day");

  const weekEnd = now.endOf("week"); // Sunday

  return {
    today: {
      start: todayStart.toUTC().toJSDate(),
      end: todayEnd.toUTC().toJSDate(),
    },
    tomorrow: {
      start: tomorrowStart.toUTC().toJSDate(),
      end: tomorrowEnd.toUTC().toJSDate(),
    },
    thisWeek: {
      start: tomorrowEnd.plus({ millisecond: 1 }).toUTC().toJSDate(),
      end: weekEnd.toUTC().toJSDate(),
    },
  };
}
