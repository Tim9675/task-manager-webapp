import TaskSidebarItem from "./TaskSidebarItem";
import ListSidebarItem from "./ListSidebarItem";
import TagSidebarItem from "./TagSidebarItem";

function SidebarItem({ nav, type, setActiveView }) {
  function renderItem() {
    switch (type) {
      case "tasks":
        return <TaskSidebarItem nav={nav} setActiveView={setActiveView} />;
      case "lists":
        return <ListSidebarItem nav={nav} setActiveView={setActiveView} />;
      case "tags":
        return <TagSidebarItem nav={nav} setActiveView={setActiveView} />;
      default:
        return null;
    }
  }
  return renderItem();
}

export default SidebarItem;
