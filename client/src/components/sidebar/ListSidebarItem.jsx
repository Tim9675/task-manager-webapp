import { useDisplay } from "../../contexts/DisplayContext";

function ListSidebarItem({ nav }) {
  const { activeView, setActiveView, isSearching, setIsSearching } =
    useDisplay();

  const isCurrentDisplay =
    activeView.type === "list" && nav._id === activeView.id && !isSearching;

  return (
    <button
      type="button"
      onClick={() => {
        setIsSearching(false);
        setActiveView({ type: "list", id: nav._id });
      }}
      className={`group flex w-full cursor-pointer items-center justify-between rounded-md px-3 ${isCurrentDisplay && "bg-[#ebebeb]"} hover:bg-[#ebebeb] md:h-9`}
      aria-current={isCurrentDisplay ? "page" : undefined}
    >
      <div className="flex min-w-0 items-center">
        <div
          className={"size-4 shrink-0 rounded"}
          style={{ backgroundColor: nav.color }}
          aria-hidden="true"
        />

        <span className="ms-3.5 truncate text-[#444444]">{nav.title}</span>
      </div>

      {nav.count > 0 && (
        <div
          className={`flex h-5 w-7.5 shrink-0 items-center justify-center rounded-sm ${isCurrentDisplay ? "bg-[#fafafa]" : "bg-[#ebebeb]"} group-hover:bg-[#fafafa]`}
        >
          <p className="text-xs">{nav.count}</p>
        </div>
      )}
    </button>
  );
}

export default ListSidebarItem;
