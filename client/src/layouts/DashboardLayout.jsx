import { useState } from "react";
import TaskList from "../components/tasks/TaskList";
import Sidebar from "../components/sidebar/Sidebar";
import TaskDetailsPanel from "../components/tasks/TaskDetailsPanel";

function DashboardLayout({ children, selectedTask, updateTask }) {
  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <main className="flex-1">{children}</main>
      <TaskDetailsPanel selectedTask={selectedTask} updateTask={updateTask} />
    </div>
  );
}

export default DashboardLayout;
