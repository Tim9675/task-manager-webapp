import { useState } from "react";
import { Menu } from "lucide-react";

import Sidebar from "../components/sidebar/Sidebar";
import TaskDetailsPanel from "../components/tasks/TaskDetailsPanel";
import SidebarSkeleton from "../components/skeletons/SidebarSkeleton";
import { useTasks } from "../contexts/TasksContext";
import { useLists } from "../contexts/ListsContext";
import { useTags } from "../contexts/TagsContext";
import { useDisplay } from "../contexts/DisplayContext";

function DashboardLayout({ children }) {
  const { isTaskDetailsOpen, closeTask } = useTasks();
  const { isLoadingLists } = useLists();
  const { isLoadingTags } = useTags();
  const { isSidebarOpen, setIsSidebarOpen } = useDisplay();

  return (
    <div className="flex h-screen w-screen">
      {isSidebarOpen ? (
        isLoadingLists || isLoadingTags ? (
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
