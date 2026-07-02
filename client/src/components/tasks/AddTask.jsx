import { Plus, Loader } from "lucide-react";
import { useState } from "react";
import { useTasks } from "../../contexts/TasksContext";

function AddTask({ activeView }) {
  const [taskTitle, setTaskTitle] = useState("");
  const { onCreateTask, isCreatingTask } = useTasks();
  return (
    <div className="mx-5 flex h-13 items-center rounded-md border border-[#ebebeb] px-3 focus-within:border-neutral-300">
      <button
        onClick={async () => {
          // Only reset task title after getting valid response
          const res = await onCreateTask(taskTitle, activeView);
          if (res) setTaskTitle("");
        }}
        disabled={isCreatingTask}
        className="flex size-9 items-center justify-center enabled:cursor-pointer disabled:cursor-not-allowed"
      >
        {isCreatingTask ? (
          <div className="motion-safe:animate-spin">
            <Loader color="#7c7c7c" size={18} strokeWidth={4} />
          </div>
        ) : (
          <Plus color="#7c7c7c" size={18} strokeWidth={4} />
        )}
      </button>
      <input
        type="text"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        onKeyDown={async (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const res = await onCreateTask(taskTitle, activeView);
            if (res) setTaskTitle("");
          }
        }}
        className="ms-1 size-full flex-1 bg-transparent text-sm outline-none"
        placeholder="Add New Task"
      />
    </div>
  );
}

export default AddTask;
