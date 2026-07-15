import { useTasks } from "../../contexts/TasksContext";
import { useDisplay } from "../../contexts/DisplayContext";
import TaskSidebarItem from "./TaskSidebarItem";
import ListSidebarItem from "./ListSidebarItem";
import TagSidebarItem from "./TagSidebarItem";

function SidebarItem({ nav, type }) {
  const { closeTask } = useTasks();
  const { activeView, setActiveView, isSearching, setIsSearching } =
    useDisplay();

  const viewTitle = nav.title.toLowerCase();
  const shouldCloseTask = nav.count == null;

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
            setActiveView({ type: viewTitle.replaceAll(" ", "") });
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

export default SidebarItem;
