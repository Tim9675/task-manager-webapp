import Task from "../models/Task.js";
import { getTodayRange, getTaskDateBuckets } from "../utils/dateRanges.js";

const DEFAULT_ZONE = "Asia/Manila"; // temporary value, change to user timezone when authentication is implemented

export async function getTasksToday(req, res) {
  try {
    const zone = req.user?.timezone || DEFAULT_ZONE;
    const userId = req.user.userId;

    const { start, end } = getTodayRange(zone);
    const tasks = await Task.find({
      userId,
      dueDate: { $ne: null, $gte: start, $lt: end },
    })
      .sort({ dueDate: 1, createdAt: 1 })
      .lean();
    res.status(200).json({ data: tasks });
  } catch (error) {
    console.error("Error in getTasksToday controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getTasksUpcoming(req, res) {
  try {
    const zone = req.user?.timezone || DEFAULT_ZONE;
    const userId = req.user.userId;

    const { today, tomorrow, thisWeek } = getTaskDateBuckets(zone);

    const tasks = await Task.find({
      userId,
      dueDate: { $ne: null, $gte: today.start, $lt: thisWeek.end },
    })
      .sort({ dueDate: 1, createdAt: 1 })
      .lean();

    const grouped = {
      today: [],
      tomorrow: [],
      thisWeek: [],
    };

    for (const task of tasks) {
      const due = task.dueDate;

      if (due >= today.start && due < today.end) {
        grouped.today.push(task);
      } else if (due >= tomorrow.start && due < tomorrow.end) {
        grouped.tomorrow.push(task);
      } else if (due >= thisWeek.start && due < thisWeek.end) {
        grouped.thisWeek.push(task);
      }
    }

    res.status(200).json({ data: grouped });
  } catch (error) {
    console.error("Error in getTasksUpcoming controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
