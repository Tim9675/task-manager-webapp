import { Menu } from "lucide-react";
import { useState, useRef } from "react";

import { useLists } from "../../contexts/ListsContext";
import { useTags } from "../../contexts/TagsContext";
import { useDisplay } from "../../contexts/DisplayContext";
import SidebarSkeleton from "../skeletons/SidebarSkeleton";
import SearchBar from "./SearchBar";
import SidebarSection from "./SidebarSection";
import SidebarModals from "./SidebarModals";
import SettingsButton from "./SettingsButton";
import SignOutButton from "./SignOutButton";

function Sidebar() {
  const [isAddListOpen, setIsAddListOpen] = useState(false);
  const [isAddTagOpen, setIsAddTagOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);

  const returnFocusRef = useRef(null);

  const { isLoadingLists } = useLists();
  const { isLoadingTags } = useTags();
  const { isSidebarOpen, setIsSidebarOpen } = useDisplay();

  return isLoadingLists || isLoadingTags ? (
    <SidebarSkeleton />
  ) : (
    <div
      className={`relative overflow-hidden transition-all duration-500 ease-in ${isSidebarOpen ? "w-77" : "w-22.5"}`}
    >
      <button
        type="button"
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        className={`absolute top-9 right-5.75 z-50 flex size-7.5 cursor-pointer items-center justify-center rounded hover:bg-[#dddddd]`}
        aria-label="Toggle sidebar"
        aria-expanded={isSidebarOpen}
        aria-controls="sidebar"
      >
        <Menu color="#7c7c7c" size={21} strokeWidth={3} />
      </button>

      <aside
        id="sidebar"
        className={`my-5 ms-5 flex h-[calc(100vh-2.5rem)] w-72 flex-col rounded-2xl bg-neutral-100 px-4 py-5 transition duration-500 ease-in ${!isSidebarOpen && "pointer-events-none translate-x-[-110%]"}`}
        inert={!isSidebarOpen}
        aria-hidden={!isSidebarOpen}
      >
        {/* Header */}
        <header className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900">Menu</h2>
        </header>

        <SearchBar />

        {/* Scrollable Content */}
        <section className="flex-1 overflow-y-auto">
          <SidebarSection title="Tasks" type={"tasks"} />
          <SidebarSection
            title="Lists"
            type={"lists"}
            onOpen={() => {
              setIsAddListOpen(true);
              returnFocusRef.current = document.activeElement;
            }}
          />
          <SidebarSection
            title="Tags"
            type={"tags"}
            onOpen={() => {
              setIsAddTagOpen(true);
              returnFocusRef.current = document.activeElement;
            }}
          />
        </section>

        {/* Modals */}
        <SidebarModals
          isAddListOpen={isAddListOpen}
          onAddListClose={() => setIsAddListOpen(false)}
          isAddTagOpen={isAddTagOpen}
          onAddTagClose={() => setIsAddTagOpen(false)}
          isSettingsOpen={isSettingsOpen}
          onSettingsClose={() => setIsSettingsOpen(false)}
          isSignOutOpen={isSignOutOpen}
          onSignOutClose={() => setIsSignOutOpen(false)}
          returnFocusRef={returnFocusRef}
        />

        {/* Footer */}
        <footer className="flex flex-col gap-1 pt-2 md:h-20">
          <SettingsButton
            onOpen={() => {
              setIsSettingsOpen(true);
              returnFocusRef.current = document.activeElement;
            }}
          />
          <SignOutButton
            onOpen={() => {
              setIsSignOutOpen(true);
              returnFocusRef.current = document.activeElement;
            }}
          />
        </footer>
      </aside>
    </div>
  );
}

export default Sidebar;
