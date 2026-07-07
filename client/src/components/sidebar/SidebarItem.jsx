import { useDisplay } from "../../contexts/DisplayContext";

import TaskSidebarItem from "./TaskSidebarItem";
import ListSidebarItem from "./ListSidebarItem";
import TagSidebarItem from "./TagSidebarItem";
import { useTasks } from "../../contexts/TasksContext";

function SidebarItem({ nav, type }) {
  const { activeView, setActiveView, isSearching, setIsSearching } =
    useDisplay();

  const { closeTask } = useTasks();

  const viewTitle = nav.title.toLowerCase();
  const shouldCloseTask =
    viewTitle !== "today" &&
    viewTitle !== "upcoming" &&
    viewTitle !== "all tasks";

  function renderItem() {
    switch (type) {
      case "tasks":
        return (
          <TaskSidebarItem
            nav={nav}
            activeView={activeView}
            isSearching={isSearching}
            onDisplayChange={() => {
              setIsSearching(false);
              if (shouldCloseTask) closeTask();

              setActiveView({
                type: viewTitle.replaceAll(" ", ""),
              });
            }}
          />
        );
      case "lists":
        return (
          <ListSidebarItem
            nav={nav}
            activeView={activeView}
            setActiveView={setActiveView}
            isSearching={isSearching}
            onDisplayChange={() => {
              setIsSearching(false);
              setActiveView({ type: "list", id: nav._id });
            }}
          />
        );
      case "tags":
        return (
          <TagSidebarItem
            nav={nav}
            activeView={activeView}
            setActiveView={setActiveView}
            isSearching={isSearching}
            onDisplayChange={() => {
              setIsSearching(false);
              setActiveView({ type: "tag", id: nav._id });
            }}
          />
        );
      default:
        return null;
    }
  }
  return renderItem();
}

export default SidebarItem;
