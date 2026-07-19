import {
  ChevronsRight,
  ListCheck,
  Notebook,
  CalendarDays,
  StickyNote,
} from "lucide-react";

import { useTasks } from "../../contexts/TasksContext";
import { useLists } from "../../contexts/ListsContext";
import { useTags } from "../../contexts/TagsContext";
import SidebarItem from "./SidebarItem";
import AddList from "./AddList";
import AddTag from "./AddTag";

function SidebarSection({ title, type, onOpen }) {
  const headingId = `${type}-heading`;
  const { todayTaskCount, upcomingTaskCount, userTasksCount } = useTasks();
  const { userListsWithCounts } = useLists();
  const { userTags } = useTags();

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

  const navList =
    type === "tasks"
      ? tasksSection
      : type === "lists"
        ? userListsWithCounts
        : userTags;

  return (
    <section className="mb-5" aria-labelledby={headingId}>
      <header>
        <h2
          id={headingId}
          className="mb-1 ps-3 text-xs text-neutral-500 uppercase"
        >
          {title}
        </h2>
      </header>

      {type === "tags" ? (
        <>
          <nav>
            <ul className="mb-2 flex w-full flex-wrap gap-1">
              {navList.map((nav) => (
                <li key={nav._id}>
                  <SidebarItem nav={nav} type={type} />
                </li>
              ))}
            </ul>
          </nav>
          <AddTag onOpen={onOpen} />
        </>
      ) : (
        <nav className="flex flex-col">
          <ul>
            {navList.map((nav) => (
              <li key={nav._id}>
                <SidebarItem nav={nav} type={type} />
              </li>
            ))}
          </ul>
        </nav>
      )}

      {type === "lists" && <AddList onOpen={onOpen} />}
      {type !== "tags" && <hr className="mx-auto mt-4 w-64 border-[#ebebeb]" />}
    </section>
  );
}

export default SidebarSection;
