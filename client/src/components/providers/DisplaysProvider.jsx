import { useState, useMemo, useContext } from "react";

import { isToday, isUpcoming } from "../../utils/date.js";
import { TasksContext } from "../../contexts/TasksContext.jsx";
import { ListsContext } from "../../contexts/ListsContext.jsx";
import { TagsContext } from "../../contexts/TagsContext.jsx";
import { DisplayContext } from "../../contexts/DisplayContext.jsx";

function DisplaysProvider({ children }) {
  const [activeView, setActiveView] = useState({
    type: "today",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isHideCompleted, setIsHideCompleted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { userTasks } = useContext(TasksContext);
  const { getListTitle } = useContext(ListsContext);
  const { getTagTitle } = useContext(TagsContext);

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

    const searched = isSearching
      ? filtered.filter((task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : filtered;

    return [...searched].sort(compareTasks);
  }, [userTasks, activeView, searchQuery, isSearching, isHideCompleted]);

  const header = useMemo(() => {
    if (isSearching) return "Search results";
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
  }, [searchQuery, isSearching, activeView, getListTitle, getTagTitle]);

  return (
    <DisplayContext.Provider
      value={{
        activeView,
        setActiveView,
        searchQuery,
        setSearchQuery,
        isSearching,
        setIsSearching,
        isHideCompleted,
        setIsHideCompleted,
        isSidebarOpen,
        setIsSidebarOpen,
        visibleTasks,
        header,
      }}
    >
      {children}
    </DisplayContext.Provider>
  );
}

// REMINDER: Add criteria "createdAt" when backend is integrated
function compareTasks(a, b) {
  if (a.checked === b.checked) return 0;
  return a.checked ? 1 : -1;
}

export default DisplaysProvider;
