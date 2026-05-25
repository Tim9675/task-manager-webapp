function ListSidebarItem({ nav, setActiveView }) {
  return (
    <button
      onClick={() =>
        setActiveView({ type: "List", id: nav.id, title: nav.title })
      }
      className="group flex w-full cursor-pointer items-center justify-between rounded-md px-3 hover:bg-[#ebebeb] md:h-9"
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
      {nav.count > 0 && (
        <div className="flex h-5 w-7.5 shrink-0 items-center justify-center rounded-sm bg-[#ebebeb] group-hover:bg-[#fafafa]">
          <p className="text-xs">{nav.count}</p>
        </div>
      )}
    </button>
  );
}

export default ListSidebarItem;
