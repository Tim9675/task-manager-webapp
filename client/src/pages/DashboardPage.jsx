import { useState } from "react";
import TaskList from "../components/tasks/TaskList";
import DashboardLayout from "../layouts/DashboardLayout";

function DashboardPage() {
  const [selectedTask, setSelectedTask] = useState(null);
  return (
    <DashboardLayout selectedTask={selectedTask}>
      <TaskList
        setSelectedTask={setSelectedTask}
        selectedTaskId={selectedTask?.id}
      />
    </DashboardLayout>
  );
}

export default DashboardPage;
