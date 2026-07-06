import { useMemo, useRef, useEffect } from "react";

import { PANEL_ANIMATION_MS } from "../../helpers/styles";

function useTaskSelection({
  userTasks,
  selectedTaskId,
  setSelectedTaskId,
  setIsTaskDetailsOpen,
}) {
  const closeTimeout = useRef();
  useEffect(() => {
    return () => clearTimeout(closeTimeout.current);
  }, []);

  const selectedTask = useMemo(
    () => userTasks.find((task) => task._id === selectedTaskId) || null,
    [userTasks, selectedTaskId],
  );

  function openTask(taskId) {
    clearTimeout(closeTimeout.current);
    setSelectedTaskId(taskId);
    setIsTaskDetailsOpen(true);
  }

  function closeTask() {
    setIsTaskDetailsOpen(false);
    closeTimeout.current = setTimeout(
      () => setSelectedTaskId(null),
      PANEL_ANIMATION_MS,
    );
  }

  function isSelectedTask(taskId) {
    return selectedTaskId === taskId;
  }

  return {
    selectedTask,
    openTask,
    closeTask,
    isSelectedTask,
  };
}

export default useTaskSelection;
