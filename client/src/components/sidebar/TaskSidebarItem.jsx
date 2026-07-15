import { useTasks } from "../../contexts/TasksContext";
import { useDisplay } from "../../contexts/DisplayContext";

function TaskSidebarItem({ nav }) {
  const { closeTask } = useTasks();
  const { activeView, setActiveView, isSearching, setIsSearching } =
    useDisplay();

  const viewType = nav.title.toLowerCase().replaceAll(" ", "");

  const Icon = nav.icon;
  const isCurrentDisplay = viewType === activeView.type && !isSearching;

  return (
    <button
      type="button"
      onClick={() => {
        setIsSearching(false);
        if (nav.count == null) closeTask();
        setActiveView({ type: viewType });
      }}
      className={`group flex w-full cursor-pointer items-center justify-between rounded-md px-3 ${isCurrentDisplay && "bg-[#ebebeb]"} hover:bg-[#ebebeb] md:h-9`}
      aria-current={isCurrentDisplay ? "page" : undefined}
    >
      <div className="flex items-center">
        <Icon color="#7c7c7c" size={20} strokeWidth={3} />
        <span className="ms-3.5 text-[#444444]">{nav.title}</span>
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
