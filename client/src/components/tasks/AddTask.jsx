import { Plus } from "lucide-react";
import { useState } from "react";

function AddTask({ createTask }) {
  const [taskToAdd, setTaskToAdd] = useState("");
  return (
    <div className="mx-5 flex h-13 items-center rounded-md border border-[#ebebeb] px-3 focus-within:border-neutral-300">
      <button
        onClick={() => {
          createTask(taskToAdd);
          setTaskToAdd("");
        }}
        className="flex size-9 cursor-pointer items-center justify-center"
      >
        <Plus color="#7c7c7c" size={18} strokeWidth={4} />
      </button>
      <input
        type="text"
        value={taskToAdd}
        onChange={(e) => setTaskToAdd(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            createTask(taskToAdd);
            setTaskToAdd("");
          }
        }}
        className="ms-1 size-full flex-1 bg-transparent text-sm outline-none"
        placeholder="Add New Task"
      />
    </div>
  );
}

export default AddTask;
