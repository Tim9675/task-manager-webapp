import { useTasks } from "../contexts/TasksContext";
import { useDisplay } from "../contexts/DisplayContext";
import DashboardLayout from "../layouts/DashboardLayout";
import StickyWall from "../components/tasks/StickyWall";
import TaskListSkeleton from "../components/skeletons/TaskListSkeleton";
import TaskList from "../components/tasks/TaskList";

function DashboardPage() {
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
