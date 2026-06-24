import { useContext, useState } from "react";
import { Menu } from "lucide-react";

import Sidebar from "../components/sidebar/Sidebar";
import TaskDetailsPanel from "../components/tasks/TaskDetailsPanel";
import SidebarSkeleton from "../components/skeletons/SidebarSkeleton";
import { TasksContext } from "../contexts/TasksContext";
import { ListsContext } from "../contexts/ListsContext";
import { DisplayContext } from "../contexts/DisplayContext";

function DashboardLayout({ children }) {
  const { isTaskDetailsOpen, closeTask } = useContext(TasksContext);
  const { isLoadingLists } = useContext(ListsContext);
  const { isSidebarOpen, setIsSidebarOpen } = useContext(DisplayContext);

  return (
    <div className="flex h-screen w-screen">
      {isSidebarOpen ? (
        isLoadingLists ? (
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

      {isTaskDetailsOpen && <TaskDetailsPanel onClose={closeTask} />}
    </div>
  );
}

export default DashboardLayout;
