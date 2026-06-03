import TaskSidebarItem from "./TaskSidebarItem";
import ListSidebarItem from "./ListSidebarItem";
import TagSidebarItem from "./TagSidebarItem";

function SidebarItem({
  nav,
  type,
  activeView,
  setActiveView,
  updateList = () => {},
  deleteList = () => {},
}) {
  function renderItem() {
    switch (type) {
      case "tasks":
        return (
          <TaskSidebarItem
            nav={nav}
            activeView={activeView}
            setActiveView={setActiveView}
          />
        );
      case "lists":
        return (
          <ListSidebarItem
            nav={nav}
            activeView={activeView}
            setActiveView={setActiveView}
            updateList={updateList}
            deleteList={deleteList}
          />
        );
      case "tags":
        return (
          <TagSidebarItem
            nav={nav}
            activeView={activeView}
            setActiveView={setActiveView}
          />
        );
      default:
        return null;
    }
  }
  return renderItem();
}

export default SidebarItem;
