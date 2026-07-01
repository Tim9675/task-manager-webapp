import { EllipsisVertical } from "lucide-react";
import { useState } from "react";

import ListModal from "./ListModal";
import DeleteListModal from "./DeleteListModal";
import { useLists } from "../../contexts/ListsContext";

function ListSidebarItem({
  nav,
  activeView,
  setActiveView,
  isSearching,
  onDisplayChange,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditListOpen, setIsEditListOpen] = useState(false);
  const [isDeleteListOpen, setIsDeleteListOpen] = useState(false);

  const { onUpdateList, onDeleteList } = useLists();

  const isCurrentDisplay =
    activeView.type === "list" && nav._id === activeView.id && !isSearching;
  return (
    <>
      {/*
      REMINDER: Decide which elements should be div and button; 
      Ellipsis can't be keyboard-navigated;
      Also add Dropdown menu keyboard navigation
      */}
      <button
        type="button"
        onClick={onDisplayChange}
        className={`group flex w-full cursor-pointer items-center justify-between rounded-md ps-3 ${isCurrentDisplay && "bg-[#ebebeb]"} hover:bg-[#ebebeb] md:h-9`}
      >
        <div className="flex min-w-0 items-center">
          <div
            className={"size-4 shrink-0 rounded"}
            style={{ backgroundColor: nav.color }}
          ></div>
          <h3 className="ms-3.5 truncate" title={nav.title}>
            {nav.title}
          </h3>
        </div>
        <div className="flex w-12.5 items-center justify-end">
          {nav.count > 0 && (
            <div
              className={`flex h-5 w-7.5 shrink-0 items-center justify-center rounded-sm ${isCurrentDisplay ? "bg-[#fafafa]" : "bg-[#ebebeb]"} group-hover:bg-[#fafafa]`}
            >
              <p className="text-xs">{nav.count}</p>
            </div>
          )}
          <div
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            onBlur={() => setIsMenuOpen(false)}
            tabIndex={0}
            // REMINDER: Not focusable on shift+tab
            className="invisible relative mx-0.5 flex h-full w-4 cursor-pointer justify-center rounded-2xl group-hover:visible group-focus:visible hover:bg-[#aaaaaa] focus:visible"
          >
            <EllipsisVertical size={20} color="#7c7c7c" />
            {isMenuOpen && (
              <>
                <div className="absolute top-full right-0 z-50 h-12 w-15 divide-y rounded-sm border border-[#7c7c7c] bg-[#fafafa]">
                  <div
                    role="button"
                    className="h-5.75 rounded-t-[3px] bg-yellow-500 hover:brightness-95"
                    onClick={() => setIsEditListOpen(true)}
                  >
                    Edit
                  </div>
                  <div
                    role="button"
                    className="h-5.75 rounded-b-[3px] bg-red-500 hover:brightness-90"
                    onClick={() => setIsDeleteListOpen(true)}
                  >
                    Delete
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </button>
      {isEditListOpen && (
        <ListModal
          mode="edit"
          list={nav}
          onListSubmit={onUpdateList}
          onClose={() => setIsEditListOpen(false)}
        />
      )}
      {isDeleteListOpen && (
        <DeleteListModal
          nav={nav}
          onDelete={async () => {
            await onDeleteList(nav._id);
            const isActiveList =
              activeView.type === "list" && activeView.id === nav._id;

            if (isActiveList) {
              setActiveView({ type: "today" });
            }
          }}
          onClose={() => setIsDeleteListOpen(false)}
        />
      )}
    </>
  );
}

export default ListSidebarItem;
