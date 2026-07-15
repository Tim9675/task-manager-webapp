import TaskSidebarItem from "./TaskSidebarItem";
import ListSidebarItem from "./ListSidebarItem";
import TagSidebarItem from "./TagSidebarItem";

function SidebarItem({ nav, type }) {
  switch (type) {
    case "tasks":
      return <TaskSidebarItem nav={nav} />;
    case "lists":
      return <ListSidebarItem nav={nav} />;
    case "tags":
      return <TagSidebarItem nav={nav} />;
    default:
      return null;
  }
}

export default SidebarItem;
