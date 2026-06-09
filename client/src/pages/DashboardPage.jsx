import { useContext, useState, useMemo } from "react";

import TaskList from "../components/tasks/TaskList";
import StickyWall from "../components/tasks/StickyWall";
import DashboardLayout from "../layouts/DashboardLayout";
import { isToday, isUpcoming } from "../utils/date";
import TaskListSkeleton from "../components/skeletons/TaskListSkeleton";
import { TasksContext } from "../contexts/TasksContext";
import { ListsContext } from "../contexts/ListsContext";
import { TagsContext } from "../contexts/TagsContext";

function DashboardPage() {
  // Load state
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isLoadingTaskDetails, setIsLoadingTaskDetails] = useState(false);
  const [isLoadingSidebar, setIsLoadingSidebar] = useState(false);

  // TaskList
  const { userTasks } = useContext(TasksContext);
  const { getListTitle } = useContext(ListsContext);
  const { getTagTitle } = useContext(TagsContext);
  const [activeView, setActiveView] = useState({
    type: "stickyWall",
  });

  // Sidebar
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isHideCompleted, setIsHideCompleted] = useState(false);

  // REMINDER: To be removed when backend connected
  const visibleTasks = useMemo(() => {
    const filtered = userTasks.filter((task) => {
      if (isHideCompleted && task.checked) return false;
      switch (activeView.type) {
        case "today":
          return isToday(task.dueDate);
        case "upcoming":
          return isUpcoming(task.dueDate);
        case "list":
          return task.listId === activeView.id;
        case "tag":
          return task.tagIds.includes(activeView.id);
        default:
          return true;
      }
    });

    const searched = searchQuery
      ? filtered.filter((task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : filtered;

    return [...searched].sort(compareTasks);
  }, [userTasks, activeView, searchQuery, isHideCompleted]);

  const header = useMemo(() => {
    if (searchQuery) return "Search results";
    switch (activeView.type) {
      case "upcoming":
        return "Upcoming";
      case "list":
        return getListTitle(activeView.id) ?? "List";
      case "tag":
        return getTagTitle(activeView.id) ?? "Tag";
      default:
        return "Today";
    }
  }, [searchQuery, activeView, getListTitle, getTagTitle]);

  return (
    <DashboardLayout
      activeView={activeView}
      setActiveView={setActiveView}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      isHideCompleted={isHideCompleted}
      setIsHideCompleted={setIsHideCompleted}
      isLoadingTaskDetails={isLoadingTaskDetails}
      isLoadingSidebar={isLoadingSidebar}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
    >
      {activeView.type === "stickyWall" ? (
        <StickyWall />
      ) : isLoadingTasks ? (
        <TaskListSkeleton header={header} />
      ) : (
        <TaskList
          tasks={visibleTasks}
          activeView={activeView}
          header={header}
          searchQuery={searchQuery}
        />
      )}
    </DashboardLayout>
  );
}

// REMINDER: Add criteria "createdAt" when backend is integrated
function compareTasks(a, b) {
  if (a.checked === b.checked) return 0;
  return a.checked ? 1 : -1;
}

export default DashboardPage;
