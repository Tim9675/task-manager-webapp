function DeleteTagModal({ onDelete, onClose }) {
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
        {/* REMINDER: Add no. of tasks with this tag */}
        <p className="my-5 text-center">Delete this tag?</p>

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
