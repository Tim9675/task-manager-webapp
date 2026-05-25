function TagSidebarItem({ nav, setActiveView }) {
  return (
    <button
      type="button"
      onClick={() =>
        setActiveView({ type: "Tag", id: nav.id, title: nav.title })
      }
      className="my-1 cursor-pointer rounded px-3.5 py-1 text-sm hover:brightness-95"
      style={{ backgroundColor: nav.color }}
    >
      <h3>{nav.title}</h3>
    </button>
  );
}

export default TagSidebarItem;
