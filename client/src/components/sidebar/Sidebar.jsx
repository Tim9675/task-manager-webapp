import {
  ChevronsRight,
  ListCheck,
  CalendarDays,
  StickyNote,
  Menu,
} from "lucide-react";
import { useState } from "react";

import SidebarSection from "./SidebarSection";
import SearchBar from "./SearchBar";
import SettingsButton from "./SettingsButton";
import SignOutButton from "./SignOutButton";
import { mockTags } from "../../mock/tags";
import SettingsModal from "./SettingsModal";

function Sidebar({
  setActiveView,
  searchQuery,
  setSearchQuery,
  isHideCompleted,
  setIsHideCompleted,
}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Should be the only one hardcoded
  const tasksSection = [
    { id: 0, title: "Upcoming", count: 12, icon: ChevronsRight },
    { id: 1, title: "Today", count: 5, icon: ListCheck },
    { id: 2, title: "Calendar", icon: CalendarDays },
    { id: 3, title: "Sticky Wall", icon: StickyNote },
  ];
  // Change to fetch later, Can't use mockLists yet, needs hardcoded list count
  const listsSection = [
    {
      id: 0,
      title: "Personally long list for a very personal person",
      color: "#ff6b6b",
      count: 3,
    },
    { id: 1, title: "Work", color: "#66d9e8", count: 6 },
    { id: 2, title: "List 1", color: "#ffd43b", count: 3 },
  ];

  const tagsSection = mockTags;

  return (
    <aside className="my-5 ms-5 flex h-[calc(100vh-2.5rem)] w-72 flex-col rounded-2xl bg-neutral-100 px-4 py-5">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-neutral-900">Menu</h2>

        <button className="cursor-pointer">
          <Menu color="#7c7c7c" size={21} strokeWidth={3} />
        </button>
      </header>

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <SidebarSection
          title="Tasks"
          type={"tasks"}
          navList={tasksSection}
          setActiveView={setActiveView}
        />
        <SidebarSection
          title="Lists"
          type={"lists"}
          navList={listsSection}
          setActiveView={setActiveView}
        />
        <SidebarSection
          title="Tags"
          type={"tags"}
          navList={tagsSection}
          setActiveView={setActiveView}
        />
      </div>

      {/* Footer */}
      <footer className="md:h-18">
        <SettingsButton onOpen={() => setIsSettingsOpen(true)} />
        {isSettingsOpen && (
          <SettingsModal
            isHideCompleted={isHideCompleted}
            setIsHideCompleted={setIsHideCompleted}
            onClose={() => setIsSettingsOpen(false)}
          />
        )}
        <SignOutButton />
      </footer>
    </aside>
  );
}

export default Sidebar;
