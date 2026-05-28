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
      <TaskDetailsPanel
        selectedTask={selectedTask}
        updateTask={updateTask}
        deleteTask={deleteTask}
      />
    </div>
  );
}

export default DashboardLayout;
