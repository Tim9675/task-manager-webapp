import { createContext, useState, useMemo } from "react";

import { isToday, isUpcoming } from "../utils/date";
import { useTasks } from "./TasksContext";
import { useLists } from "./ListsContext";
import { useTags } from "./TagsContext";

const DisplayContext = createContext();

function compareTasks(a, b) {
  if (a.checked === b.checked) {
    const aParsedDate = Date.parse(a.dueDate);
    const bParsedDate = Date.parse(b.dueDate);

    return aParsedDate - bParsedDate;
  }
  return a.checked ? 1 : -1;
}

function taskMatchesView(task, activeView, isHideCompleted) {
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
}

export function DisplayProvider({ children }) {
  const [activeView, setActiveView] = useState({
    type: "today",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isHideCompleted, setIsHideCompleted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { userTasks } = useTasks();
  const { getListTitle } = useLists();
  const { getTagTitle } = useTags();

  const visibleTasks = useMemo(() => {
    const filtered = userTasks.filter((task) =>
      taskMatchesView(task, activeView, isHideCompleted),
    );

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
      case "alltasks":
        return "All Tasks";
      case "list":
        return getListTitle(activeView.id) ?? "List";
      case "tag":
        return getTagTitle(activeView.id) ?? "Tag";
      default:
        return "Today";
    }
  }, [isSearching, activeView, getListTitle, getTagTitle]);

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
