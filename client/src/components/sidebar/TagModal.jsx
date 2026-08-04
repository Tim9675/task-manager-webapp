import { useState, useRef } from "react";

import { useTags } from "../../contexts/useTags";
import { onSubmitResult } from "../utils/onSubmitResult";
import Modal from "../modals/Modal";

function TagModal({ mode, tag = {}, onTagSubmit, onClose, returnFocusRef }) {
  const [tagTitle, setTagTitle] = useState(tag?.title ?? "");
  const [tagColor, setTagColor] = useState(tag?.color ?? "#d1eaed");
  const [isTagDuplicate, setIsTagDuplicate] = useState(false);

  const colorRefs = useRef([]);

  const { availableTagColors, isCreatingTag, isUpdatingTag } = useTags();

  const isEdit = mode === "edit";
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

  function handleColorKeyDown(e, index) {
    let nextIndex;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = (index + 1) % availableTagColors.length;
        break;

      case "ArrowLeft":
      case "ArrowUp":
        nextIndex =
          (index - 1 + availableTagColors.length) % availableTagColors.length;
        break;

      default:
        return;
    }

    e.preventDefault();

    setTagColor(availableTagColors[nextIndex].value);
    colorRefs.current[nextIndex]?.focus();
  }

  return (
    <Modal
      header={isEdit ? "Edit tag" : "Add new tag"}
      onAction={async () => {
        await submitTag();
      }}
      onClose={onClose}
      isLoading={isLoading}
      isEmpty={!tagTitle.trim()}
      action={buttonContent}
      returnFocusRef={returnFocusRef}
    >
      <div className="flex h-20 w-full flex-col justify-evenly">
        <div className="flex h-10 w-full items-center rounded border-2 border-[#ebebeb]">
          <div
            className="mx-2 size-4 rounded"
            style={{ backgroundColor: tagColor }}
          />
          <label htmlFor="tag-title" className="sr-only">
            Tag title
          </label>
          <input
            id="tag-title"
            type="text"
            value={tagTitle}
            autoFocus
            required
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
            aria-describedby={isEdit ? "edit-tag-error" : "create-tag-error"}
          />
        </div>
        <div
          role="radiogroup"
          className="mt-2.5 flex h-5 w-full items-center justify-evenly"
          aria-label="Choose tag color"
        >
          {availableTagColors.map((color, index) => (
            <button
              key={color.value}
              ref={(el) => (colorRefs.current[index] = el)}
              type="button"
              role="radio"
              tabIndex={tagColor === color.value ? 0 : -1}
              onClick={() => setTagColor(color.value)}
              onKeyDown={(e) => handleColorKeyDown(e, index)}
              className={`size-4 cursor-pointer rounded ${tagColor === color.value && "outline outline-offset-6 outline-blue-600"} focus-visible:ring-2 focus-visible:ring-blue-600`}
              style={{ backgroundColor: color.value }}
              aria-label={`Select ${color.label} tag color`}
              aria-checked={tagColor === color.value}
            />
          ))}
        </div>
      </div>

      <p
        id={isEdit ? "edit-tag-error" : "create-tag-error"}
        role="alert"
        className={`mt-2.5 h-5 w-full text-center text-red-600 ${isTagDuplicate ? "visible" : "invisible"}`}
      >
        This tag already exists.
      </p>
    </Modal>
  );
}

export default TagModal;
