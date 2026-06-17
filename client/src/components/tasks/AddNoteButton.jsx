import { Plus } from "lucide-react";

function AddNoteButton({ onAdd }) {
  return (
    <button
      type="button"
      className="flex aspect-square w-full cursor-pointer items-center justify-center rounded-lg bg-[#ebebeb] p-5 hover:brightness-95"
      onClick={onAdd}
    >
      <Plus size={75} color="#212529" />
    </button>
  );
}

export default AddNoteButton;
