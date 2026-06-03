import { Menu } from "lucide-react";

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
  isSidebarOpen,
  setIsSidebarOpen,
  userLists,
  userListsWithCounts,
  createList,
  updateList,
  deleteList,
}) {
  return (
    <div className="flex h-screen w-screen">
      {isSidebarOpen ? (
        isLoadingSidebar ? (
          <SidebarSkeleton />
        ) : (
          <Sidebar
            activeView={activeView}
            setActiveView={setActiveView}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isHideCompleted={isHideCompleted}
            setIsHideCompleted={setIsHideCompleted}
            onClose={() => setIsSidebarOpen(false)}
            userLists={userListsWithCounts}
            createList={createList}
            updateList={updateList}
            deleteList={deleteList}
          />
        )
      ) : (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="mx-9 mt-9 flex h-7.5 w-7.5 cursor-pointer items-center justify-center bg-amber-500"
        >
          <Menu color="#7c7c7c" size={21} strokeWidth={3} />
        </button>
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
            userLists={userLists}
          />
        )
      ) : null}
    </div>
  );
}

export default DashboardLayout;
