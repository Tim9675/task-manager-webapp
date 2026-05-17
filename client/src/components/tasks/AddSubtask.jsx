import { Plus } from "lucide-react";
import { useState } from "react";

function AddSubtask({ append }) {
  const [subtask, setSubtask] = useState("");

  function addSubtask(subtask) {
    if (!subtask.trim()) return;
    append({
      title: subtask,
      checked: false,
    });
    setSubtask("");
  }

  return (
    <div className="flex items-center border-b border-[#ebebeb] px-3 focus-within:border-neutral-300 md:h-9">
      <button
        type="button"
        onClick={() => addSubtask(subtask)}
        className="flex size-9 cursor-pointer items-center justify-center"
      >
        <Plus color="#7c7c7c" size={18} strokeWidth={4} />
      </button>
      <input
        type="text"
        value={subtask}
        onChange={(e) => setSubtask(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addSubtask(subtask);
          }
        }}
        className="ms-1 size-full flex-1 bg-transparent text-sm outline-none"
        placeholder="Add New Subtask"
      />
    </div>
  );
}

export default AddSubtask;
