import { EllipsisVertical, Tag } from "lucide-react";
import { useContext, useState } from "react";

import TagModal from "./TagModal";
import { TagsContext } from "../../contexts/TagsContext";
import DeleteTagModal from "./DeleteTagModal";

function TagSidebarItem({ nav, activeView, setActiveView }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditTagOpen, setIsEditTagOpen] = useState(false);
  const [isDeleteTagOpen, setIsDeleteTagOpen] = useState(false);

  const { updateTag, deleteTag } = useContext(TagsContext);
  return (
    <>
      {/*
      REMINDER: Decide which elements should be div and button; 
      Ellipsis can't be keyboard-navigated;
      Also add Dropdown menu keyboard navigation
      */}
      <button
        type="button"
        onClick={() => setActiveView({ type: "tag", id: nav.id })}
        className={`group relative z-20 my-1 cursor-pointer rounded px-4 py-1 text-sm hover:brightness-95 ${activeView?.type === "tag" && activeView?.id === nav.id ? "inset-shadow-xs" : "shadow-xs"} shadow-[#aaaaaa] inset-shadow-[#aaaaaa] active:inset-shadow-xs ${isMenuOpen ? "z-50" : "z-0"}`}
        style={{ backgroundColor: nav.color }}
      >
        <h3>{nav.title}</h3>
        <div
          role="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          onBlur={() => setIsMenuOpen(false)}
          tabIndex={0}
          className="absolute top-1/2 right-0 ms-1 hidden -translate-y-1/2 rounded-2xl group-focus-within:block group-hover:block hover:bg-[#aaaaaa] focus:block"
        >
          <EllipsisVertical size={15} color={"#7c7c7c"} />
          {isMenuOpen && (
            <>
              <div className="absolute top-full right-0 z-50 h-12 w-15 divide-y rounded-sm border border-[#7c7c7c] bg-[#fafafa]">
                <div
                  role="button"
                  className="h-5.75 rounded-t-[3px] bg-yellow-500 hover:brightness-95"
                  onClick={() => setIsEditTagOpen(true)}
                >
                  Edit
                </div>
                <div
                  role="button"
                  className="h-5.75 rounded-b-[3px] bg-red-500 hover:brightness-90"
                  onClick={() => setIsDeleteTagOpen(true)}
                >
                  Delete
                </div>
              </div>
            </>
          )}
        </div>
      </button>

      {isEditTagOpen && (
        <TagModal
          mode="edit"
          tag={nav}
          tagFunction={updateTag}
          onClose={() => setIsEditTagOpen(false)}
        />
      )}
      {isDeleteTagOpen && (
        <DeleteTagModal
          onDelete={() => deleteTag(nav.id)}
          onClose={() => setIsDeleteTagOpen(false)}
        />
      )}
    </>
  );
}

export default TagSidebarItem;
