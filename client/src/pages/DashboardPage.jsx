import { useTasks } from "../contexts/TasksContext";
import { useDisplay } from "../contexts/DisplayContext";
import DashboardLayout from "../layouts/DashboardLayout";
import StickyWall from "../components/tasks/StickyWall";
import Upcoming from "../components/tasks/Upcoming";
import TaskListSkeleton from "../components/skeletons/TaskListSkeleton";
import TaskList from "../components/tasks/TaskList";

function DashboardPage() {
  const { isLoadingTasks } = useTasks();
  const { activeView, isSearching } = useDisplay();

  return (
    <DashboardLayout>
      {activeView.type === "stickywall" ? (
        <StickyWall />
      ) : activeView.type === "upcoming" && !isSearching ? (
        <Upcoming />
      ) : isLoadingTasks ? (
        <TaskListSkeleton />
      ) : (
        <TaskList />
      )}
    </DashboardLayout>
  );
}

export default DashboardPage;
