import {
  ChevronsRight,
  ListCheck,
  CalendarDays,
  StickyNote,
  Menu,
} from "lucide-react";
import { useContext, useState } from "react";

import SidebarSection from "./SidebarSection";
import SearchBar from "./SearchBar";
import SettingsButton from "./SettingsButton";
import SignOutButton from "./SignOutButton";
import SettingsModal from "./SettingsModal";
import ListModal from "./ListModal";
import { ListsContext } from "../../contexts/ListsContext";
import { TagsContext } from "../../contexts/TagsContext";
import TagModal from "./TagModal";
import { TasksContext } from "../../contexts/TasksContext";

function Sidebar({ onClose }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddListOpen, setIsAddListOpen] = useState(false);
  const [isAddTagOpen, setIsAddTagOpen] = useState(false);

  const { todayTaskCount, upcomingTaskCount } = useContext(TasksContext);
  const { userListsWithCounts, createList } = useContext(ListsContext);
  const { userTags, createTag } = useContext(TagsContext);

  // Should be the only one hardcoded
  const tasksSection = [
    { id: 0, title: "Upcoming", count: upcomingTaskCount, icon: ChevronsRight },
    { id: 1, title: "Today", count: todayTaskCount, icon: ListCheck },
    { id: 2, title: "Calendar", icon: CalendarDays },
    { id: 3, title: "Sticky Wall", icon: StickyNote },
  ];

  return (
    <aside className="my-5 ms-5 flex h-[calc(100vh-2.5rem)] w-72 flex-col rounded-2xl bg-neutral-100 px-4 py-5">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-neutral-900">Menu</h2>

        <button
          onClick={onClose}
          className="flex size-6 cursor-pointer items-center justify-center rounded hover:bg-[#dddddd]"
        >
          <Menu color="#7c7c7c" size={21} strokeWidth={3} />
        </button>
      </header>

      <SearchBar />

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <SidebarSection title="Tasks" type={"tasks"} navList={tasksSection} />
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
          listFunction={createList}
          onClose={() => setIsAddListOpen(false)}
        />
      )}

      {isAddTagOpen && (
        <TagModal
          mode="create"
          tagFunction={createTag}
          onClose={() => setIsAddTagOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="md:h-18">
        <SettingsButton onOpen={() => setIsSettingsOpen(true)} />
        {isSettingsOpen && (
          <SettingsModal onClose={() => setIsSettingsOpen(false)} />
        )}
        <SignOutButton />
      </footer>
    </aside>
  );
}

export default Sidebar;
