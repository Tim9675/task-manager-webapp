import {
  ChevronsRight,
  ListCheck,
  CalendarDays,
  StickyNote,
} from "lucide-react";

import SidebarSection from "./SidebarSection";

function Sidebar() {
  // Should be the only one hardcoded
  const tasksSection = [
    { id: 0, title: "Upcoming", count: 12, icon: ChevronsRight },
    { id: 1, title: "Today", count: 5, icon: ListCheck },
    { id: 2, title: "Calendar", icon: CalendarDays },
    { id: 3, title: "Sticky Wall", icon: StickyNote },
  ];
  // Change to fetch later
  const listsSection = [
    { id: 0, title: "Personal", color: "#ff6b6b", count: 3 },
    { id: 1, title: "Work", color: "#66d9e8", count: 6 },
    { id: 2, title: "List 1", color: "#ffd43b", count: 3 },
  ];
  // Change to fetch later
  const tagsSection = [
    { id: 0, title: "Tag 1", color: "#d1eaed" },
    { id: 1, title: "Tag 2", color: "#ffdada" },
  ];

  return (
    <aside className="my-5 ms-5 flex h-[calc(100vh-2.5rem)] w-72 flex-col rounded-2xl bg-neutral-100 px-4 py-5">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-neutral-900">Menu</h2>

        {/* Future menu toggle */}
        {/* <MenuToggle /> */}
      </header>

      {/* Future search */}
      {/* <Search /> */}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <SidebarSection title="Tasks" type={"tasks"} navList={tasksSection} />
        <SidebarSection title="Lists" type={"lists"} navList={listsSection} />
        <SidebarSection title="Tags" type={"tags"} navList={tagsSection} />
      </div>

      {/* Footer */}
      <footer className="mt-4 border-t border-neutral-200 pt-4">
        {/* <SettingsButton /> */}
        {/* <SignOutButton /> */}
      </footer>
    </aside>
  );
}

export default Sidebar;
