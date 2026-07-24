import { useState } from "react";
import { Loader, Plus } from "lucide-react";

import { useTasks } from "../../contexts/TasksContext";

function AddTask({ activeView }) {
  const [taskTitle, setTaskTitle] = useState("");
  const { onCreateTask, isCreatingTask } = useTasks();

  async function createTask() {
    const res = await onCreateTask(taskTitle, activeView);

    if (res) setTaskTitle("");
  }

  return (
    <div className="mx-5 flex h-13 items-center rounded-md border border-[#ebebeb] px-3 focus-within:border-neutral-300">
      <button
        type="button"
        onClick={createTask}
        disabled={isCreatingTask || !taskTitle.trim()}
        className="flex size-9 items-center justify-center rounded-md hover:bg-gray-100 hover:brightness-95 enabled:cursor-pointer disabled:cursor-not-allowed"
        aria-label={isCreatingTask ? "Creating task" : "Add new task"}
      >
        {isCreatingTask ? (
          <div className="motion-safe:animate-spin">
            <Loader color="#7c7c7c" size={18} strokeWidth={4} />
          </div>
        ) : (
          <Plus color="#7c7c7c" size={18} strokeWidth={4} />
        )}
      </button>

      <label htmlFor={`new-task-${activeView.id}`} className="sr-only">
        Task title
      </label>
      <input
        id={`new-task-${activeView.id}`}
        type="text"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && taskTitle.trim()) {
            e.preventDefault();
            createTask();
          }
        }}
        disabled={isCreatingTask}
        className="ms-1 size-full flex-1 bg-transparent text-sm outline-none"
        placeholder="Add New Task"
      />
    </div>
  );
}

export default AddTask;
