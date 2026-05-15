import { Plus } from "lucide-react";

function AddList() {
  return (
    <button
      className="flex w-full cursor-pointer items-center rounded-md px-3 hover:bg-[#ebebeb] md:h-9"
      onClick={() => alert("List added")}
    >
      <Plus color={"#7c7c7c"} size={16} strokeWidth={4} />
      <h3 className="ms-3.5">Add New List</h3>
    </button>
  );
}

export default AddList;
