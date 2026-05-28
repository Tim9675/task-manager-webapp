import Sidebar from "../components/sidebar/Sidebar";
import TaskDetailsPanel from "../components/tasks/TaskDetailsPanel";

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
}) {
  return (
    <div className="flex h-screen w-screen">
      <Sidebar
        setActiveView={setActiveView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isHideCompleted={isHideCompleted}
        setIsHideCompleted={setIsHideCompleted}
      />
      <main className="flex-1">{children}</main>

      {isTaskDetailsOpen && (
        <TaskDetailsPanel
          selectedTask={selectedTask}
          updateTask={updateTask}
          deleteTask={deleteTask}
          onClose={() => setIsTaskDetailsOpen(false)}
        />
      )}
    </div>
  );
}

export default DashboardLayout;
