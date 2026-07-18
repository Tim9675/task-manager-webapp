import { useLists } from "../../contexts/ListsContext";
import { useTags } from "../../contexts/TagsContext";
import { useDisplay } from "../../contexts/DisplayContext";
import ListModal from "../sidebar/ListModal";
import TagModal from "../sidebar/TagModal";
import Modal from "../modals/Modal";

function TaskListActions({
  isEdit,
  isDelete,
  type,
  item,
  onClose,
  taskCount,
  returnFocusRef,
}) {
  const { onUpdateList, onDeleteList, isDeletingList } = useLists();
  const { onUpdateTag, onDeleteTag, isDeletingTag } = useTags();
  const { setActiveView } = useDisplay();

  const isPlural = taskCount > 1;

  return (
    <>
      {type === "list" && isEdit && (
        <ListModal
          mode="edit"
          list={item}
          onListSubmit={onUpdateList}
          onClose={onClose}
          returnFocusRef={returnFocusRef}
        />
      )}
      {type === "tag" && isEdit && (
        <TagModal
          mode="edit"
          tag={item}
          onTagSubmit={onUpdateTag}
          onClose={onClose}
          returnFocusRef={returnFocusRef}
        />
      )}
      {type === "list" && isDelete && (
        <Modal
          header="Warning!"
          onAction={async () => {
            await onDeleteList(item._id);
            setActiveView({ type: "today" });
            onClose();
          }}
          onClose={onClose}
          isLoading={isDeletingList}
          action={isDeletingList ? "Deleting..." : "Delete"}
          returnFocusRef={returnFocusRef}
        >
          <p className="my-5 text-center wrap-anywhere">
            Delete the list "{item.title}"?
          </p>

          {taskCount > 0 && (
            <div role="alert" className="text-xs text-red-600">
              <p>
                {taskCount} task{isPlural && "s"} belong
                {!isPlural && "s"} to this list.
              </p>
              <p>{isPlural ? "They" : "It"} will become unlisted.</p>
            </div>
          )}
        </Modal>
      )}
      {type === "tag" && isDelete && (
        <Modal
          header="Warning!"
          onAction={async () => {
            await onDeleteTag(item._id);
            setActiveView({ type: "today" });
            onClose();
          }}
          onClose={onClose}
          isLoading={isDeletingTag}
          action={isDeletingTag ? "Deleting..." : "Delete"}
          returnFocusRef={returnFocusRef}
        >
          <p className="my-5 text-center wrap-anywhere">
            Delete the tag "{item.title}"?
          </p>

          {taskCount > 0 && (
            <div role="alert" className="text-xs text-red-600">
              <p>
                {taskCount} task{isPlural && "s"} belong
                {!isPlural && "s"} to this tag.
              </p>
              <p>{isPlural ? "They" : "It"} will become unlisted.</p>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}

export default TaskListActions;
