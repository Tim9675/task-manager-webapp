import Sidebar from "../components/sidebar/Sidebar";
import TaskDetailsPanel from "../components/tasks/TaskDetailsPanel";
import TaskDetailsPanelSkeleton from "../components/skeletons/TaskDetailsPanelSkeleton";
import SidebarSkeleton from "../components/skeletons/SidebarSkeleton";

function DashboardLayout({
  children,
  selectedTask,
  updateTask,
  deleteTask,
  activeView,
  setActiveView,
  searchQuery,
  setSearchQuery,
  isHideCompleted,
  setIsHideCompleted,
  isTaskDetailsOpen,
  setIsTaskDetailsOpen,
  isLoadingTaskDetails,
  isLoadingSidebar,
}) {
  return (
    <div className="flex h-screen w-screen">
      {isLoadingSidebar ? (
        <SidebarSkeleton />
      ) : (
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isHideCompleted={isHideCompleted}
          setIsHideCompleted={setIsHideCompleted}
        />
      )}
      <main className="flex-1">{children}</main>

      {isTaskDetailsOpen ? (
        isLoadingTaskDetails ? (
          <TaskDetailsPanelSkeleton
            onClose={() => setIsTaskDetailsOpen(false)}
          />
        ) : (
          <TaskDetailsPanel
            selectedTask={selectedTask}
            updateTask={updateTask}
            deleteTask={deleteTask}
            onClose={() => setIsTaskDetailsOpen(false)}
          />
        )
      ) : null}
    </div>
  );
}

export default DashboardLayout;
