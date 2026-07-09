import { useState } from "react";

import { useTags } from "../../contexts/TagsContext";
import Modal from "../modals/Modal";
import { onSubmitResult } from "../helpers/onSubmitResult";

function TagModal({ isOpen, mode, tag = {}, onTagSubmit, onClose }) {
  if (!isOpen) return null;

  const isEdit = mode === "edit";

  const [tagTitle, setTagTitle] = useState(isEdit ? tag.title : "");
  const [tagColor, setTagColor] = useState(isEdit ? tag.color : "#d1eaed");
  const [isTagDuplicate, setIsTagDuplicate] = useState(false);

  const { availableTagColors, isCreatingTag, isUpdatingTag } = useTags();

  const isLoading = isCreatingTag || isUpdatingTag;

  const buttonContent = isCreatingTag
    ? "Creating..."
    : isUpdatingTag
      ? "Saving..."
      : isEdit
        ? "Save"
        : "Create";

  async function submitTag() {
    try {
      const curr = {
        title: tagTitle,
        color: tagColor,
      };

      const result = await onSubmitResult(isEdit, tag, curr, onTagSubmit);

      if (!result.success) {
        if (result.error === "duplicate") {
          setIsTagDuplicate(true);
        }
        return;
      }
      onClose();
    } catch (error) {
      console.log("Error in TagModal.jsx");
      console.log(error);
    }
  }

  return (
    <Modal
      isOpen={true}
      header={isEdit ? "Edit tag" : "Add new tag"}
      onAction={async () => {
        await submitTag();
      }}
      onClose={onClose}
      isLoading={isLoading}
      isEmpty={!tagTitle.trim()}
      action={buttonContent}
    >
      {/* Toggle hide completed tasks */}
      <div className="flex h-20 w-full flex-col justify-evenly">
        <div className="flex h-10 w-full items-center rounded border-2 border-[#ebebeb]">
          <div
            className="mx-2 size-4 rounded"
            style={{ backgroundColor: tagColor }}
          ></div>
          <input
            type="text"
            value={tagTitle}
            autoFocus
            onChange={(e) => {
              setTagTitle(e.target.value);
              setIsTagDuplicate(false);
            }}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                await submitTag();
              }
            }}
            className="h-full w-55 rounded-md px-2.5"
          />
        </div>
        <div className="mt-2.5 flex h-5 w-full items-center justify-evenly">
          {availableTagColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setTagColor(color)}
              className={`size-4 cursor-pointer rounded ${tagColor === color && "outline outline-offset-6 outline-[#ebebeb]"}`}
              style={{ backgroundColor: color }}
            ></button>
          ))}
        </div>
      </div>

      <div className="mt-2.5 h-5 w-full text-center text-red-600">
        {isTagDuplicate && "This tag already exists."}
      </div>
    </Modal>
  );
}

export default TagModal;
