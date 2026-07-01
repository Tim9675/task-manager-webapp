import { useState } from "react";

import TaskList from "../components/tasks/TaskList";
import StickyWall from "../components/tasks/StickyWall";
import DashboardLayout from "../layouts/DashboardLayout";
import TaskListSkeleton from "../components/skeletons/TaskListSkeleton";
import { useDisplay } from "../contexts/DisplayContext";
import { useTasks } from "../contexts/TasksContext";

function DashboardPage() {
  // Load state
  const { isLoadingTasks } = useTasks();

  const { activeView, header } = useDisplay();

  return (
    <DashboardLayout>
      {activeView.type === "stickywall" ? (
        <StickyWall />
      ) : isLoadingTasks ? (
        <TaskListSkeleton header={header} />
      ) : (
        <TaskList header={header} />
      )}
    </DashboardLayout>
  );
}

export default DashboardPage;
