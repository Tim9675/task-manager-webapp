import { Plus } from "lucide-react";

function AddTaskTags() {
  return (
    <button
      type="button"
      className="my-1 flex cursor-pointer items-center rounded bg-[#ebebeb] px-3.5 py-1 text-sm hover:brightness-95"
    >
      <Plus color={"#444444"} size={9} strokeWidth={5} />
      <h3 className="ms-1">Add Tag</h3>
    </button>
  );
}

export default AddTaskTags;
