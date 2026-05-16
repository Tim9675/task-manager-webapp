import { Plus } from "lucide-react";

function AddTask() {
  return (
    <div className="mx-5 flex h-13 items-center rounded-md border border-[#ebebeb] px-3 focus-within:border-neutral-300">
      <button className="flex size-9 cursor-pointer items-center justify-center">
        <Plus color="#7c7c7c" size={18} strokeWidth={4} />
      </button>
      <input
        type="text"
        className="ms-1 size-full flex-1 bg-transparent text-sm outline-none"
        placeholder="Add New Task"
      />
    </div>
  );
}

export default AddTask;
