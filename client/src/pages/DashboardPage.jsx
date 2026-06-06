import { useContext, useState } from "react";

import TaskList from "../components/tasks/TaskList";
import DashboardLayout from "../layouts/DashboardLayout";
import { isToday, isUpcoming } from "../utils/date";
import TaskListSkeleton from "../components/skeletons/TaskListSkeleton";
import { TasksContext } from "../contexts/TasksContext";
import { ListsContext } from "../contexts/ListsContext";
import { TagsContext } from "../contexts/TagsContext";
import { mockTags } from "../mock/tags";

function DashboardPage() {
  // Load state
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isLoadingTaskDetails, setIsLoadingTaskDetails] = useState(false);
  const [isLoadingSidebar, setIsLoadingSidebar] = useState(false);

  // TaskList
  const { userTasks, removeTagFromTasks } = useContext(TasksContext);
  const { userLists } = useContext(ListsContext);
  const [isHideCompleted, setIsHideCompleted] = useState(false);
  const [activeView, setActiveView] = useState({
    type: "today",
  });

  // Sidebar
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userTags, setUserTags] = useState(mockTags);

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

  // Tag functions
  function createTag(title, color) {
    const normalizedTitle = title.trim().toLowerCase();
    const duplicate = userTags.some(
      (tag) => tag.title.trim().toLowerCase() === normalizedTitle,
    );
    if (!normalizedTitle) return { success: false, error: "empty" };
    if (duplicate) return { success: false, error: "duplicate" };
    const newTag = {
      id: crypto.randomUUID(),
      title: title,
      color: color,
    };
    setUserTags((prev) => [...prev, newTag]);
    return { success: true };
  }

  function updateTag(updatedTag) {
    const normalizedTitle = updatedTag.title.trim().toLowerCase();
    if (!normalizedTitle) return { success: false, error: "empty" };
    const duplicate = userTags.some(
      (tag) =>
        tag.id !== updatedTag.id &&
        tag.title.trim().toLowerCase() === normalizedTitle,
    );
    if (duplicate) return { success: false, error: "duplicate" };
    setUserTags((prev) =>
      prev.map((tag) => (tag.id === updatedTag.id ? updatedTag : tag)),
    );
    return { success: true };
  }

  function deleteTag(tagId) {
    setUserTags((prev) => prev.filter((tag) => tag.id !== tagId));
    removeTagFromTasks(tagId);
    if (activeView.type === "tag" && activeView.id === tagId) {
      setActiveView({ type: "today" });
    }
  }
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
        const list = userLists.find((list) => list.id === activeView.id);
        return list?.title ?? "List";
      case "tag":
        const tag = userTags.find((tag) => tag.id === activeView.id);
        return tag?.title ?? "Tag";
      default:
        return "Today";
    }
  }

  const visibleTasks = searchQuery
    ? [...searchedTasks].sort(compare)
    : [...filteredTasks].sort(compare);

  return (
    <TagsContext.Provider value={{ userTags, createTag, updateTag, deleteTag }}>
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
    </TagsContext.Provider>
  );
}

export default DashboardPage;
