import Modal from "../modals/Modal";
import ListModal from "./ListModal";
import TagModal from "./TagModal";

function SidebarModals({
  isAddListOpen,
  onCreateList,
  onAddListClose,
  isAddTagOpen,
  onCreateTag,
  onAddTagClose,
  isSettingsOpen,
  onSettingsClose,
  isHideCompleted,
  setIsHideCompleted,
  returnFocusRef,
}) {
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
          onAction={async () => {
            // placeholder for future updateSettings function
            setIsSettingsOpen(false);
          }}
          onClose={onSettingsClose}
          isLoading={false}
          action={"Save"}
          returnFocusRef={returnFocusRef}
        >
          {/* Toggle hide completed tasks */}
          <div className="flex max-h-60 flex-col gap-1 overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsHideCompleted(!isHideCompleted)}
              className="flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-neutral-50"
              aria-label="Toggle hide completed tasks"
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
        </Modal>
      )}
    </>
  );
}

export default SidebarModals;
