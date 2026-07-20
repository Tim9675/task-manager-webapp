import { useLists } from "../../contexts/ListsContext";
import { useTags } from "../../contexts/TagsContext";
import ListModal from "./ListModal";
import TagModal from "./TagModal";
import SettingsModal from "../modals/SettingsModal";
import SignoutModal from "../modals/SignoutModal";

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
  const { onCreateList } = useLists();
  const { onCreateTag } = useTags();

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
        <SettingsModal
          onSettingsClose={onSettingsClose}
          returnFocusRef={returnFocusRef}
        />
      )}

      {isSignOutOpen && (
        <SignoutModal
          onSignOutClose={onSignOutClose}
          returnFocusRef={returnFocusRef}
        />
      )}
    </>
  );
}

export default SidebarModals;
