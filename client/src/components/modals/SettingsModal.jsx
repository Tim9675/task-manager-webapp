import { useDisplay } from "../../contexts/DisplayContext";
import Modal from "../../components/modals/Modal";

function SettingsModal({ onSettingsClose, returnFocusRef }) {
  const { isHideCompleted, setIsHideCompleted } = useDisplay();

  const settingItems = [
    {
      id: "hideCompleted",
      label: "Hide completed tasks",
      checked: isHideCompleted,
    },
  ];

  function toggleSetting(id) {
    switch (id) {
      case "hideCompleted":
        setIsHideCompleted((prev) => !prev);
        break;

      default:
        break;
    }
  }

  return (
    <Modal
      header="Settings"
      onAction={() => {
        // FUT: placeholder for future updateSettings function; bring back async when applied
        onSettingsClose();
      }}
      onClose={onSettingsClose}
      isLoading={false}
      action={"Save"}
      returnFocusRef={returnFocusRef}
    >
      <ul className="max-h-60 overflow-y-auto">
        {settingItems.map((setting) => (
          <li key={setting.id} className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => toggleSetting(setting.id)}
              className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-neutral-50"
              aria-pressed={setting.checked}
            >
              <p className="ms-3">{setting.label}</p>

              <div
                className={`flex size-4 items-center justify-center rounded border text-xs ${
                  setting.checked
                    ? "border-neutral-700 bg-neutral-700 text-white"
                    : "border-neutral-300"
                }`}
                aria-hidden="true"
              >
                {setting.checked && "✓"}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  );
}

export default SettingsModal;
