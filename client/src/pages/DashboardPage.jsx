import { useTasks } from "../contexts/useTasks";
import { useDisplay } from "../contexts/useDisplay";
import DashboardLayout from "../layouts/DashboardLayout";
import StickyWall from "../components/tasks/notes/StickyWall";
import Upcoming from "../components/tasks/list/Upcoming";
import TaskListSkeleton from "../components/skeletons/TaskListSkeleton";
import TaskList from "../components/tasks/list/TaskList";

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
