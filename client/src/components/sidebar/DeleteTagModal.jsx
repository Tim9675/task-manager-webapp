import { useContext } from "react";
import { TasksContext } from "../../contexts/TasksContext";

function DeleteTagModal({ nav, onDelete, onClose }) {
  const { userTasks } = useContext(TasksContext);
  const tasksWithThisTag = userTasks.filter((task) =>
    task.tagIds.includes(nav.id),
  );
  const taskCount = tasksWithThisTag.length;

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
          <h2 className="text-lg font-semibold text-neutral-800">Warning!</h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-sm text-neutral-500 hover:text-neutral-700"
          >
            ✕
          </button>
        </div>

        <p className="my-5 text-center">Delete "{nav.title}" tag?</p>

        {taskCount > 0 && (
          <div className="text-xs text-red-600">
            <p>
              {taskCount} task{taskCount > 1 && "s"} currently use this tag.
            </p>
            <p>The tag will be removed from those tasks.</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 flex justify-evenly">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-md bg-[#f5f5f5] px-4 py-2 text-sm font-medium hover:brightness-95"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="cursor-pointer rounded-md bg-[#ffd43b] px-4 py-2 text-sm font-medium hover:brightness-95"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteTagModal;
