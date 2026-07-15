import { useDisplay } from "../../contexts/DisplayContext";

function TagSidebarItem({ nav }) {
  const { activeView, setActiveView, isSearching, setIsSearching } =
    useDisplay();

  const isCurrentDisplay =
    activeView.type === "tag" && activeView.id === nav._id && !isSearching;

  return (
    <button
      type="button"
      onClick={() => {
        setIsSearching(false);
        setActiveView({ type: "tag", id: nav._id });
      }}
      className={`group relative z-20 my-1 cursor-pointer rounded px-4 py-1 text-sm hover:brightness-95 ${isCurrentDisplay ? "inset-shadow-xs" : "shadow-xs"} shadow-[#aaaaaa] inset-shadow-[#aaaaaa] active:inset-shadow-xs`}
      style={{ backgroundColor: nav.color }}
      aria-current={isCurrentDisplay ? "page" : undefined}
    >
      <span className="text-[#444444]">{nav.title}</span>
    </button>
  );
}

export default TagSidebarItem;
