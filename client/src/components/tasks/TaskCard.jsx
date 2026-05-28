import Checkbox from "@mui/material/Checkbox";
import { ChevronRight } from "lucide-react";

import { mockLists } from "../../mock/lists";

function TaskCard({ task, toggleTask, onSelect, isSelected }) {
  const label = { slotProps: { input: { "aria-label": "Checkbox" } } };
  const sx = {
    color: "#dddddd",
    aspectRatio: 1 / 1,
    "&.Mui-checked": {
      color: "#ffd43b",
    },
    "&.Mui-checked + button > p": {
      color: "#7c7c7c",
      textDecoration: "line-through",
    },
  };

  const userLists = mockLists;

  const listDetails = userLists.find((list) => list.id === task.listId) || null;

  // NEXT TASK: Style Task Card for completed tasks

  return (
    <div
      className={`items-center border-[#ebebeb] transition-colors not-first:border-t md:min-h-10 ${isSelected ? "bg-[#f5f5f5]" : "hover:bg-[#fcfcfc]"}`}
    >
      <div className="flex min-h-11 items-center">
        <Checkbox
          {...label}
          checked={task.checked}
          onChange={(e) => {
            toggleTask(task, e.target.checked);
          }}
          sx={sx}
        />
        <button
          onClick={onSelect}
          className="flex grow cursor-pointer items-center justify-between py-2 pe-2"
        >
          <p className="task-title line-clamp-1 text-sm text-neutral-800">
            {task.title}
          </p>
          <ChevronRight color="#7c7c7c" size={18} strokeWidth={3} />
        </button>
      </div>
      {/* Metadata */}
      {(listDetails || task.subtasks.length > 0) && (
        <div className="ms-9 flex items-center gap-3 pb-2 text-neutral-500">
          {/* List */}
          {/* REMINDER: This is inefficient, we should fetch list details when fetching tasks instead of searching through lists on every card render
          ERROR: This causes a bug where if you add a task to a list, the task won't show the list color until you refresh or change views, because the list details aren't updated in the task card
          REMINDER: We also need to do this for tags when we implement them, so we should probably just change our data structure to include list and tag details in the task object when we fetch tasks
          REMINDER: Don't render list details at all for tasks in the "List" view, since we already know the list details from the active view, we can just pass it down as a prop to avoid unnecessary searching through lists */}
          {listDetails && (
            <div className="flex items-center gap-2">
              <div
                className="size-3 rounded"
                style={{ backgroundColor: listDetails.color }}
              ></div>
              <p className="text-xs">{listDetails.name}</p>
            </div>
          )}

          {/* Subtasks */}
          {task.subtasks.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <div className="flex h-4 min-w-4 items-center justify-center rounded bg-[#ebebeb] px-1 text-[0.625rem]">
                <p>{task.subtasks.length}</p>
              </div>
              <p>Subtasks</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskCard;
