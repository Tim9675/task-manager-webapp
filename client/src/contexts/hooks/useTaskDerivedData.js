import { useMemo } from "react";

import { isToday, isUpcoming } from "../../utils/date.js";

function useTaskDerivedData({ userTasks }) {
  const todayTaskCount = useMemo(
    () =>
      userTasks.filter((task) => !task.checked && isToday(task.dueDate)).length,
    [userTasks],
  );

  const upcomingTaskCount = useMemo(
    () =>
      userTasks.filter((task) => !task.checked && isUpcoming(task.dueDate))
        .length,
    [userTasks],
  );

  const userTasksCount = useMemo(
    () => userTasks.filter((task) => !task.checked).length,
    [userTasks],
  );

  return {
    todayTaskCount,
    upcomingTaskCount,
    userTasksCount,
  };
}

export default useTaskDerivedData;
