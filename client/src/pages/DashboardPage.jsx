import { useContext, useState } from "react";

import TaskList from "../components/tasks/TaskList";
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
  const [isHideCompleted, setIsHideCompleted] = useState(false);
  const [activeView, setActiveView] = useState({
    type: "today",
  });

  // Sidebar
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // REMINDER: To be removed when backend connected
  const filteredTasks = userTasks.filter((task) => {
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

  const searchedTasks = filteredTasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // REMINDER: Change criteria to createdAt when backend is integrated
  function compare(a, b) {
    if (a.checked === b.checked) return 0;

    return a.checked ? 1 : -1;
  }

  function renderHeader() {
    if (searchQuery) return "Search results";
    switch (activeView.type) {
      case "upcoming":
        return "Upcoming";
      case "list":
        const list = getListTitle(activeView.id);
        return list ?? "List";
      case "tag":
        const tag = getTagTitle(activeView.id);
        return tag ?? "Tag";
      default:
        return "Today";
    }
  }

  const visibleTasks = searchQuery
    ? [...searchedTasks].sort(compare)
    : [...filteredTasks].sort(compare);

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
      {isLoadingTasks ? (
        <TaskListSkeleton header={renderHeader()} />
      ) : (
        <TaskList
          tasks={visibleTasks}
          activeView={activeView}
          header={renderHeader()}
          searchQuery={searchQuery}
          isLoadingTasks={isLoadingTasks}
        />
      )}
    </DashboardLayout>
  );
}

export default DashboardPage;
