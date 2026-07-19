import { useAuth } from "../../contexts/AuthContext";
import { useLists } from "../../contexts/ListsContext";
import { useTags } from "../../contexts/TagsContext";
import { useDisplay } from "../../contexts/DisplayContext";
import Modal from "../modals/Modal";
import ListModal from "./ListModal";
import TagModal from "./TagModal";

function SidebarModals({
  isAddListOpen,
  onAddListClose,
  isAddTagOpen,
  onAddTagClose,
  isSettingsOpen,
  onSettingsClose,
  isSignOutOpen,
  onSignOutClose,
  returnFocusRef,
}) {
  const { signOut } = useAuth();
  const { onCreateList } = useLists();
  const { onCreateTag } = useTags();
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
    <>
      {isAddListOpen && (
        <ListModal
          mode="create"
          onListSubmit={onCreateList}
          onClose={onAddListClose}
          returnFocusRef={returnFocusRef}
        />
      )}

      {isAddTagOpen && (
        <TagModal
          mode="create"
          onTagSubmit={onCreateTag}
          onClose={onAddTagClose}
          returnFocusRef={returnFocusRef}
        />
      )}

      {isSettingsOpen && (
        <Modal
          header="Settings"
          onAction={() => {
            // placeholder for future updateSettings function; bring back async when applied
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
                  {/* Left Side */}
                  <p className="ms-3">{setting.label}</p>

                  {/* Right Side */}
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
      )}

      {isSignOutOpen && (
        <Modal
          header="Sign out"
          onAction={signOut}
          onClose={onSignOutClose}
          isLoading={false}
          action="Sign out"
          descriptionId="signout-description"
          returnFocusRef={returnFocusRef}
        >
          <p role="alert" id="signout-description" className="my-5 text-center">
            You're about to be signed out.
          </p>
        </Modal>
      )}
    </>
  );
}

export default SidebarModals;
