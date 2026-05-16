import { Plus } from "lucide-react";

function AddSubtask() {
  return (
    <div className="flex items-center border-b border-[#ebebeb] px-3 focus-within:border-neutral-300 md:h-9">
      <button
        type="button"
        className="flex size-9 cursor-pointer items-center justify-center"
      >
        <Plus color="#7c7c7c" size={18} strokeWidth={4} />
      </button>
      <input
        type="text"
        className="ms-1 size-full flex-1 bg-transparent text-sm outline-none"
        placeholder="Add New Subtask"
      />
    </div>
  );
}

export default AddSubtask;
