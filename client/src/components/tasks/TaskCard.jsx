import { ChevronRight } from "lucide-react";
import Checkbox from "@mui/material/Checkbox";

import { useTasks } from "../../contexts/TasksContext";

function TaskCard({ task, headingLevel, onSelect, listDetails }) {
  const { isSelectedTask, onToggleTask } = useTasks();

  const sx = {
    color: "#dddddd",
    aspectRatio: 1 / 1,
    "&.Mui-checked": {
      color: "#ffd43b",
    },
  };

  const Heading = `h${headingLevel}`;

  const isSelected = isSelectedTask(task._id);

  return (
    <article
      className={`items-center border-[#ebebeb] transition-colors not-first:border-t md:min-h-10 ${isSelected ? "bg-[#f5f5f5]" : "hover:bg-[#fcfcfc]"}`}
    >
      <div className="flex min-h-11 items-center">
        <Checkbox
          slotProps={{
            input: { "aria-label": `Toggle ${task.title} completion` },
          }}
          checked={task.checked}
          onChange={(e) => {
            onToggleTask(task._id, e.target.checked);
          }}
          sx={sx}
        />

        <button
          type="button"
          onClick={onSelect}
          className="flex grow cursor-pointer items-center justify-between py-2 pe-2"
          aria-label={`View details for ${task.title}`}
        >
          <Heading
            className={`task-title line-clamp-1 text-sm ${task.checked ? "text-neutral-500! line-through" : "text-neutral-800"}`}
          >
            {task.title}
          </Heading>

          <ChevronRight color="#7c7c7c" size={18} strokeWidth={3} />
        </button>
      </div>

      {/* DOC: Metadata */}
      {(listDetails || task.subtasks.length > 0) && (
        <footer className="ms-9 flex items-center gap-3 pb-2 text-neutral-600">
          {listDetails && (
            <div className="flex items-center gap-2">
              <div
                className="size-3 rounded"
                style={{ backgroundColor: listDetails.color }}
                aria-hidden="true"
              />
              <p className="text-xs">{listDetails.title}</p>
            </div>
          )}

          {task.subtasks.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <div className="flex h-4 min-w-4 items-center justify-center rounded bg-[#ebebeb] px-1 text-[0.625rem]">
                <p>{task.subtasks.length}</p>
              </div>

              <p>{task.subtasks.length === 1 ? "Subtask" : "Subtasks"}</p>
            </div>
          )}
        </footer>
      )}
    </article>
  );
}

export default TaskCard;
