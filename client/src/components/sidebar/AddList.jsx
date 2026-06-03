import { Plus } from "lucide-react";

function AddList({ onOpen }) {
  return (
    <button
      type="button"
      className="flex w-full cursor-pointer items-center rounded-md px-3 hover:bg-[#ebebeb] md:h-9"
      onClick={onOpen}
    >
      <Plus color={"#7c7c7c"} size={16} strokeWidth={4} />
      <h3 className="ms-3.5">Add New List</h3>
    </button>
  );
}

export default AddList;
