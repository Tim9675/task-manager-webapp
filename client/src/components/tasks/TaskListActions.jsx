import { useLists } from "../../contexts/ListsContext";
import { useTags } from "../../contexts/TagsContext";
import { useDisplay } from "../../contexts/DisplayContext";
import ListModal from "../sidebar/ListModal";
import TagModal from "../sidebar/TagModal";
import DeleteItemModal from "../modals/DeleteItemModal";

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
        <DeleteItemModal
          itemType="list"
          title={item.title}
          onDelete={async () => {
            await onDeleteList(item._id);
            setActiveView({ type: "today" });
            onClose();
          }}
          isDeleting={isDeletingList}
          onClose={onClose}
          descriptionId="delete-list-description"
          returnFocusRef={returnFocusRef}
        >
          {taskCount > 0 && (
            <div role="alert" className="text-xs text-red-600">
              <p>
                {taskCount} task{isPlural && "s"} belong
                {!isPlural && "s"} to this list.
              </p>
              <p>{isPlural ? "They" : "It"} will become unlisted.</p>
            </div>
          )}
        </DeleteItemModal>
      )}
      {type === "tag" && isDelete && (
        <DeleteItemModal
          itemType="tag"
          title={item.title}
          onDelete={async () => {
            await onDeleteTag(item._id);
            setActiveView({ type: "today" });
            onClose();
          }}
          isDeleting={isDeletingTag}
          onClose={onClose}
          descriptionId="delete-tag-description"
          returnFocusRef={returnFocusRef}
        >
          {taskCount > 0 && (
            <div role="alert" className="text-xs text-red-600">
              <p>
                {taskCount} task{isPlural && "s"} belong
                {!isPlural && "s"} to this tag.
              </p>
              <p>{isPlural ? "They" : "It"} will become unlisted.</p>
            </div>
          )}
        </DeleteItemModal>
      )}
    </>
  );
}

export default TaskListActions;
