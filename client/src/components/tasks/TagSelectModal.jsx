function TagSelectModal({ availableTags, selectedTagIds, toggleTag, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="w-72 rounded-xl bg-white p-4 shadow-lg">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-800">
            Select Tags
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-sm text-neutral-500 hover:text-neutral-700"
          >
            ✕
          </button>
        </div>

        {/* Tag List */}
        <div className="flex max-h-60 flex-col gap-1 overflow-y-auto">
          {availableTags.map((tag) => {
            const isSelected = selectedTagIds.includes(tag.id);

            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={`flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                  isSelected ? "bg-neutral-100" : "hover:bg-neutral-50"
                }`}
              >
                {/* Left Side */}
                <div className="flex items-center">
                  <div
                    className="size-3 rounded"
                    style={{ backgroundColor: tag.color }}
                  />

                  <p className="ms-3">{tag.title}</p>
                </div>

                {/* Right Side */}
                <div
                  className={`flex size-4 items-center justify-center rounded border text-xs ${
                    isSelected
                      ? "border-neutral-700 bg-neutral-700 text-white"
                      : "border-neutral-300"
                  }`}
                >
                  {isSelected && "✓"}
                </div>
              </button>
            );
          })}
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

export default TagSelectModal;
