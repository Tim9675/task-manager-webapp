import { SlidersHorizontal } from "lucide-react";

function SettingsButton({ onOpen }) {
  return (
    <button
      onClick={onOpen}
      className="my-1 flex w-full cursor-pointer items-center rounded-md px-2 hover:bg-[#ebebeb] md:h-8"
    >
      <SlidersHorizontal color="#7c7c7c" size={20} strokeWidth={2} />
      <h3 className="ms-3.5 text-sm">Settings</h3>
    </button>
  );
}

export default SettingsButton;
