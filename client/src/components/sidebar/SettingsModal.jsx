import { useContext } from "react";
import { DisplayContext } from "../../contexts/DisplayContext";

function SettingsModal({ onClose }) {
  const { isHideCompleted, setIsHideCompleted } = useContext(DisplayContext);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-72 rounded-xl bg-white p-4 shadow-lg"
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-800">Settings</h2>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-sm text-neutral-500 hover:text-neutral-700"
          >
            ✕
          </button>
        </div>

        {/* Toggle hide completed tasks */}
        <div className="flex max-h-60 flex-col gap-1 overflow-y-auto">
          <button
            type="button"
            onClick={() => setIsHideCompleted(!isHideCompleted)}
            className="flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-neutral-50"
          >
            {/* Left Side */}
            <p className="ms-3">Hide completed tasks</p>

            {/* Right Side */}
            <div
              className={`flex size-4 items-center justify-center rounded border text-xs ${
                isHideCompleted
                  ? "border-neutral-700 bg-neutral-700 text-white"
                  : "border-neutral-300"
              }`}
            >
              {isHideCompleted && "✓"}
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-[#ffd43b] px-4 py-2 text-sm font-medium hover:brightness-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
