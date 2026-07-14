import {
  ChevronsRight,
  ListCheck,
  Notebook,
  CalendarDays,
  StickyNote,
} from "lucide-react";

import { useTasks } from "../../contexts/TasksContext";
import SidebarSection from "./SidebarSection";

function SidebarBody({
  userListsWithCounts,
  userTags,
  onAddListOpen,
  onAddTagOpen,
}) {
  const { todayTaskCount, upcomingTaskCount, userTasksCount } = useTasks();

  // Should be the only one hardcoded
  const tasksSection = [
    {
      _id: 0,
      title: "Upcoming",
      count: upcomingTaskCount,
      icon: ChevronsRight,
    },
    { _id: 1, title: "Today", count: todayTaskCount, icon: ListCheck },
    { _id: 2, title: "All Tasks", count: userTasksCount, icon: Notebook },
    { _id: 3, title: "Calendar", icon: CalendarDays },
    { _id: 4, title: "Sticky Wall", icon: StickyNote },
  ];

  return (
    <section className="flex-1 overflow-y-auto">
      <SidebarSection title="Tasks" type={"tasks"} navList={tasksSection} />
      <SidebarSection
        title="Lists"
        type={"lists"}
        navList={userListsWithCounts}
        onOpen={onAddListOpen}
      />
      <SidebarSection
        title="Tags"
        type={"tags"}
        navList={userTags}
        onOpen={onAddTagOpen}
      />
    </section>
  );
}

export default SidebarBody;
