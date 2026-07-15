import { Plus } from "lucide-react";

function AddList({ onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full cursor-pointer items-center rounded-md px-3 hover:bg-[#ebebeb] md:h-9"
    >
      <Plus color={"#7c7c7c"} size={16} strokeWidth={4} />
      <span className="ms-3.5">Add New List</span>
    </button>
  );
}

export default AddList;
