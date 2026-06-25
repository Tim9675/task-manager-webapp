import { useContext } from "react";
import { DisplayContext } from "../../contexts/DisplayContext";

import TaskSidebarItem from "./TaskSidebarItem";
import ListSidebarItem from "./ListSidebarItem";
import TagSidebarItem from "./TagSidebarItem";

function SidebarItem({ nav, type }) {
  const { activeView, setActiveView, isSearching, setIsSearching } =
    useContext(DisplayContext);

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
              setActiveView({
                type: nav.title.toLowerCase().replaceAll(" ", ""),
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
