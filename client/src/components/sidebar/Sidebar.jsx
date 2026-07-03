import {
  ChevronsRight,
  ListCheck,
  CalendarDays,
  StickyNote,
  Menu,
  Notebook,
} from "lucide-react";
import { useState } from "react";

import SidebarSection from "./SidebarSection";
import SearchBar from "./SearchBar";
import SettingsButton from "./SettingsButton";
import SignOutButton from "./SignOutButton";
import SettingsModal from "./SettingsModal";
import ListModal from "./ListModal";
import SidebarSkeleton from "../skeletons/SidebarSkeleton";
import { useTasks } from "../../contexts/TasksContext";
import { useLists } from "../../contexts/ListsContext";
import { useTags } from "../../contexts/TagsContext";
import TagModal from "./TagModal";
import { useDisplay } from "../../contexts/DisplayContext";

function Sidebar() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddListOpen, setIsAddListOpen] = useState(false);
  const [isAddTagOpen, setIsAddTagOpen] = useState(false);

  const { todayTaskCount, upcomingTaskCount, userTasksCount } = useTasks();
  const { userListsWithCounts, onCreateList, isLoadingLists } = useLists();
  const { userTags, onCreateTag, isLoadingTags } = useTags();
  const { isSidebarOpen, setIsSidebarOpen } = useDisplay();

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

  function render() {
    return isLoadingLists || isLoadingTags ? (
      <SidebarSkeleton />
    ) : (
      <div
        className={`relative transition-all duration-500 ease-in ${isSidebarOpen ? "w-77" : "w-25.5"}`}
      >
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`absolute top-9 right-5.75 z-50 flex size-7.5 cursor-pointer items-center justify-center rounded hover:bg-[#dddddd]`}
        >
          <Menu color="#7c7c7c" size={21} strokeWidth={3} />
        </button>
        <aside
          className={`my-5 ms-5 flex h-[calc(100vh-2.5rem)] w-72 flex-col rounded-2xl bg-neutral-100 px-4 py-5 transition duration-500 ease-in ${!isSidebarOpen && "translate-x-[-110%]"}`}
        >
          {/* Header */}
          <header className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900">Menu</h2>
          </header>

          <SearchBar />

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <SidebarSection
              title="Tasks"
              type={"tasks"}
              navList={tasksSection}
            />
            <SidebarSection
              title="Lists"
              type={"lists"}
              navList={userListsWithCounts}
              setIsAddListOpen={setIsAddListOpen}
            />
            <SidebarSection
              title="Tags"
              type={"tags"}
              navList={userTags}
              setIsAddTagOpen={setIsAddTagOpen}
            />
          </div>

          {/* Modals */}
          {isAddListOpen && (
            <ListModal
              mode="create"
              onListSubmit={onCreateList}
              onClose={() => setIsAddListOpen(false)}
            />
          )}

          {isAddTagOpen && (
            <TagModal
              mode="create"
              onTagSubmit={onCreateTag}
              onClose={() => setIsAddTagOpen(false)}
            />
          )}

          {/* Footer */}
          <footer className="md:h-20">
            <SettingsButton onOpen={() => setIsSettingsOpen(true)} />
            {isSettingsOpen && (
              <SettingsModal onClose={() => setIsSettingsOpen(false)} />
            )}
            <SignOutButton />
          </footer>
        </aside>
      </div>
    );
  }

  return render();
}

export default Sidebar;
