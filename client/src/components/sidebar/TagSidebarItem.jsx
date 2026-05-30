function TagSidebarItem({ nav, activeView, setActiveView }) {
  return (
    <button
      type="button"
      onClick={() =>
        setActiveView({ type: "tag", id: nav.id, title: nav.title })
      }
      className={`my-1 cursor-pointer rounded px-3.5 py-1 text-sm hover:brightness-95 ${activeView?.type === "tag" && activeView?.id === nav.id ? "inset-shadow-xs" : "shadow-xs"} shadow-[#aaaaaa] inset-shadow-[#aaaaaa] active:inset-shadow-xs`}
      style={{ backgroundColor: nav.color }}
    >
      <h3>{nav.title}</h3>
    </button>
  );
}

export default TagSidebarItem;
