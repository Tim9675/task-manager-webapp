import { useState } from "react";
import { Plus } from "lucide-react";

import { showWarning } from "../../contexts/helpers/showApiResponse";

function AddSubtask({ onAdd }) {
  const [title, setTitle] = useState("");

  function addSubtask() {
    const trimmed = title.trim();

    if (!trimmed) {
      showWarning("Subtask title is required!");
      return;
    }

    onAdd(trimmed);
    setTitle("");
  }

  return (
    <div className="flex items-center border-b border-[#ebebeb] px-3 focus-within:border-neutral-300 md:h-9">
      <button
        type="button"
        onClick={addSubtask}
        className="flex size-9 cursor-pointer items-center justify-center disabled:cursor-not-allowed"
        aria-label="Add new subtask"
      >
        <Plus color="#7c7c7c" size={18} strokeWidth={4} />
      </button>

      <label htmlFor="new-subtask" className="sr-only">
        New subtask title
      </label>
      <input
        id="new-subtask"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addSubtask();
          }
        }}
        className="ms-1 size-full flex-1 bg-transparent text-sm outline-none"
        placeholder="Add new subtask"
      />
    </div>
  );
}

export default AddSubtask;
