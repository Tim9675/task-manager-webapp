function TaskSidebarItem({ nav, activeView, isSearching, onDisplayChange }) {
  const Icon = nav.icon;
  const isCurrentDisplay =
    nav.title.toLowerCase().replaceAll(" ", "") === activeView.type &&
    !isSearching;
  return (
    <button
      type="button"
      className={`group flex w-full cursor-pointer items-center justify-between rounded-md px-3 ${isCurrentDisplay && "bg-[#ebebeb]"} hover:bg-[#ebebeb] md:h-9`}
      onClick={onDisplayChange}
    >
      <div className="flex items-center">
        <Icon color="#7c7c7c" size={20} strokeWidth={3} />
        <h3 className="ms-3.5">{nav.title}</h3>
      </div>
      {nav.count > 0 && (
        <div
          className={`flex h-5 w-7.5 items-center justify-center rounded-sm ${isCurrentDisplay ? "bg-[#fafafa]" : "bg-[#ebebeb]"} group-hover:bg-[#fafafa]`}
        >
          <p className="text-xs">{nav.count}</p>
        </div>
      )}
    </button>
  );
}

export default TaskSidebarItem;
