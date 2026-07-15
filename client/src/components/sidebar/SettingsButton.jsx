import { SlidersHorizontal } from "lucide-react";

function SettingsButton({ onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full cursor-pointer items-center rounded-md px-2 hover:bg-[#ebebeb] md:h-8"
    >
      <SlidersHorizontal color="#7c7c7c" size={20} strokeWidth={2} />
      <span className="ms-3.5 text-sm text-[#444444]">Settings</span>
    </button>
  );
}

export default SettingsButton;
