import { useContext, useState } from "react";
import { Menu } from "lucide-react";

import Sidebar from "../components/sidebar/Sidebar";
import TaskDetailsPanel from "../components/tasks/TaskDetailsPanel";
import TaskDetailsPanelSkeleton from "../components/skeletons/TaskDetailsPanelSkeleton";
import SidebarSkeleton from "../components/skeletons/SidebarSkeleton";
import { TasksContext } from "../contexts/TasksContext";
import { DisplayContext } from "../contexts/DisplayContext";

function DashboardLayout({ children }) {
  const [isLoadingTaskDetails, setIsLoadingTaskDetails] = useState(false);
  const [isLoadingSidebar, setIsLoadingSidebar] = useState(false);

  const { isTaskDetailsOpen, closeTask } = useContext(TasksContext);
  const { isSidebarOpen, setIsSidebarOpen } = useContext(DisplayContext);

  return (
    <div className="flex h-screen w-screen">
      {isSidebarOpen ? (
        isLoadingSidebar ? (
          <SidebarSkeleton />
        ) : (
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        )
      ) : (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="mx-9 mt-9 flex h-7.5 w-7.5 cursor-pointer items-center justify-center rounded hover:bg-[#f5f5f5]"
        >
          <Menu color="#7c7c7c" size={21} strokeWidth={3} />
        </button>
      )}
      <main className="flex-1">{children}</main>

      {isTaskDetailsOpen ? (
        isLoadingTaskDetails ? (
          <TaskDetailsPanelSkeleton onClose={closeTask} />
        ) : (
          <TaskDetailsPanel onClose={closeTask} />
        )
      ) : null}
    </div>
  );
}

export default DashboardLayout;
