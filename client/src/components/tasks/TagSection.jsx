import { useState } from "react";

import AddTaskTags from "./AddTaskTags";
import Modal from "../modals/Modal";
import TagCard from "./TagCard";

function TagSection({ availableTags, watch, setValue }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedTagIds = watch("tagIds") || [];
  const selectedTags = availableTags.filter((tag) =>
    selectedTagIds.includes(tag._id),
  );

  function toggleTag(tagId) {
    const next = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter((id) => id !== tagId)
      : [...selectedTagIds, tagId];

    setValue("tagIds", next, { shouldDirty: true, shouldTouch: true });
  }

  return (
    <div className="flex h-20 w-full items-start justify-between">
      <label className="my-2 text-sm">Tags</label>
      <div className="flex max-h-20 flex-wrap gap-1 overflow-y-auto rounded-md border border-[#ebebeb] px-2.5 md:w-65">
        {selectedTags.map((tag) => (
          <TagCard key={tag._id} tag={tag} />
        ))}
        <AddTaskTags onOpen={() => setIsModalOpen(true)} />
        <Modal
          isOpen={isModalOpen}
          header="Select Tags"
          onAction={() => setIsModalOpen(false)}
          onClose={() => setIsModalOpen(false)}
          action="Done"
        >
          {/* Tag List */}
          {availableTags.length === 0 ? (
            <p className="text-md my-7.5 text-center font-medium text-neutral-800">
              You don't have any tags.
            </p>
          ) : (
            <div className="flex max-h-60 flex-col gap-1 overflow-y-auto">
              {availableTags.map((tag) => {
                const isSelected = selectedTagIds.includes(tag._id);

                return (
                  <button
                    key={tag._id}
                    type="button"
                    onClick={() => toggleTag(tag._id)}
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
          )}
        </Modal>
      </div>
    </div>
  );
}

export default TagSection;
