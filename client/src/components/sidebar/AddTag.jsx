import { Plus } from "lucide-react";

function AddTag({ onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="my-1 flex cursor-pointer items-center rounded bg-[#ebebeb] px-3.5 py-1 text-sm shadow-xs shadow-[#aaaaaa] inset-shadow-[#aaaaaa] hover:brightness-95 active:inset-shadow-xs"
    >
      <Plus color={"#444444"} size={9} strokeWidth={5} />
      <span className="ms-1">Add Tag</span>
    </button>
  );
}

export default AddTag;
