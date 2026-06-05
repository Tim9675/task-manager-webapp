import { useState } from "react";

import TaskList from "../components/tasks/TaskList";
import DashboardLayout from "../layouts/DashboardLayout";
import { mockTasks } from "../mock/tasks";
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

  // TaskDetailsPanel
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // TaskList
  const [userTasks, setUserTasks] = useState(mockTasks);
  const [isHideCompleted, setIsHideCompleted] = useState(false);
  const [activeView, setActiveView] = useState({
    type: "today",
  });

  // Sidebar
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userLists, setUserLists] = useState([
    {
      id: "a898ca19-a1d0-40ea-aa88-e4f4378049f2",
      title: "Personally long list for a very personal person",
      color: "#ff6b6b",
    },
    {
      id: "c9c8614c-db60-45d7-bd75-1963166d7e39",
      title: "Work",
      color: "#66d9e8",
    },
    {
      id: "8ebae8d4-5d61-4497-9714-5f521b10154c",
      title: "List 1",
      color: "#ffd43b",
    },
  ]);
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

  // Task functions
  function createTask(title) {
    if (!title.trim()) return;
    const newTask = {
      id: crypto.randomUUID(),
      title: title,
      description: "",
      dueDate: activeView.type === "today" ? new Date() : null,
      listId: activeView.type === "list" ? activeView.id : null,
      tagIds: activeView.type === "tag" ? [activeView.id] : [],
      subtasks: [],
      checked: false,
    };

    setUserTasks((prev) => [...prev, newTask]);
    setSelectedTaskId(newTask.id);
    setIsTaskDetailsOpen(true);
  }

  function toggleTask(taskToToggle, checked) {
    setUserTasks((prev) =>
      prev.map((task) =>
        task.id === taskToToggle.id ? { ...task, checked } : task,
      ),
    );
  }

  function updateTask(updatedTask) {
    setUserTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );
  }

  function deleteTask(taskId) {
    setUserTasks((prev) => prev.filter((task) => task.id !== taskId));

    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
      setIsTaskDetailsOpen(false);
    }
  }

  // List functions
  function createList(title, color) {
    const normalizedTitle = title.trim().toLowerCase();
    const duplicate = userLists.some(
      (list) => list.title.trim().toLowerCase() === normalizedTitle,
    );
    if (!normalizedTitle) return { success: false, error: "empty" };
    if (duplicate) return { success: false, error: "duplicate" };
    const newList = {
      id: crypto.randomUUID(),
      title: title,
      color: color,
    };
    setUserLists((prev) => [...prev, newList]);
    return { success: true };
  }

  function updateList(updatedList) {
    const normalizedTitle = updatedList.title.trim().toLowerCase();
    if (!normalizedTitle) return { success: false, error: "empty" };
    const duplicate = userLists.some(
      (list) =>
        list.id !== updatedList.id &&
        list.title.trim().toLowerCase() === normalizedTitle,
    );
    if (duplicate) return { success: false, error: "duplicate" };
    setUserLists((prev) =>
      prev.map((list) => (list.id === updatedList.id ? updatedList : list)),
    );
    return { success: true };
  }

  function deleteList(listId) {
    setUserLists((prev) => prev.filter((list) => list.id !== listId));

    setUserTasks((prev) =>
      prev.map((task) => {
        return listId === task.listId ? { ...task, listId: null } : task;
      }),
    );

    if (activeView.type === "list" && activeView.id === listId) {
      setActiveView({ type: "today" });
    }
  }

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
    setUserTasks((prev) =>
      prev.map((task) => {
        const tagList = task.tagIds;
        if (tagList.includes(tagId)) {
          const updatedTagList = tagList.filter((id) => id !== tagId);
          return { ...task, tagIds: updatedTagList };
        }
        return task;
      }),
    );

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
    // Memoize in the future
    <TasksContext.Provider
      value={{
        userTasks,
        // selectedTaskId only used inside TaskCard.jsx
        selectedTaskId,
        // createTask only used inside AddTask.jsx
        createTask,
        // updateTask only used inside TaskForm.jsx
        updateTask,
        // toggleTask only used inside TaskCard.jsx
        toggleTask,
        // deleteTask only used inside TaskDetailsPanel.jsx
        deleteTask,
      }}
    >
      <ListsContext.Provider
        value={{
          userLists,
          createList,
          updateList,
          deleteList,
        }}
      >
        <TagsContext.Provider
          value={{ userTags, createTag, updateTag, deleteTag }}
        >
          <DashboardLayout
            activeView={activeView}
            setActiveView={setActiveView}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isHideCompleted={isHideCompleted}
            setIsHideCompleted={setIsHideCompleted}
            isTaskDetailsOpen={isTaskDetailsOpen}
            setIsTaskDetailsOpen={setIsTaskDetailsOpen}
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
                setSelectedTaskId={setSelectedTaskId}
                searchQuery={searchQuery}
                setIsTaskDetailsOpen={setIsTaskDetailsOpen}
                isLoadingTasks={isLoadingTasks}
              />
            )}
          </DashboardLayout>
        </TagsContext.Provider>
      </ListsContext.Provider>
    </TasksContext.Provider>
  );
}

export default DashboardPage;
