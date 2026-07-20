import Modal from "../modals/Modal";

function TagSelectorModal({
  userTags,
  draftTagIds,
  toggleTag,
  setValue,
  onClose,
  returnFocusRef,
}) {
  const userHasNoTags = userTags.length === 0;

  return (
    <Modal
      header="Select Tags"
      onAction={() => {
        setValue("tagIds", draftTagIds, {
          shouldDirty: true,
          shouldTouch: true,
        });
        onClose();
      }}
      onClose={onClose}
      action="Done"
      descriptionId={userHasNoTags ? "empty-tags-description" : undefined}
      returnFocusRef={returnFocusRef}
    >
      {/* Tag List */}
      {userHasNoTags ? (
        <p
          id="empty-tags-description"
          className="text-md my-7.5 text-center font-medium text-neutral-800"
        >
          You don't have any tags.
        </p>
      ) : (
        <ul className="flex max-h-60 flex-col gap-1 overflow-y-auto">
          {userTags.map((tag) => {
            const isSelected = draftTagIds.includes(tag._id);

            return (
              <li key={tag._id}>
                <button
                  key={tag._id}
                  type="button"
                  onClick={() => toggleTag(tag._id)}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                    isSelected ? "bg-neutral-100" : "hover:bg-neutral-50"
                  }`}
                  aria-pressed={isSelected}
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
                    aria-hidden="true"
                  >
                    {isSelected && "✓"}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Modal>
  );
}

export default TagSelectorModal;
