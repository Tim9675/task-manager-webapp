import { useState, useRef } from "react";

import { useLists } from "../../contexts/useLists";
import { onSubmitResult } from "../helpers/onSubmitResult";
import Modal from "../modals/Modal";

function ListModal({ mode, list = {}, onListSubmit, onClose, returnFocusRef }) {
  const [listTitle, setListTitle] = useState(list?.title ?? "");
  const [listColor, setListColor] = useState(list?.color ?? "#ff6b6b");
  const [isListDuplicate, setIsListDuplicate] = useState(false);

  const colorRefs = useRef([]);

  const { availableListColors, isCreatingList, isUpdatingList } = useLists();

  const isEdit = mode === "edit";
  const isLoading = isCreatingList || isUpdatingList;

  const buttonContent = isCreatingList
    ? "Creating..."
    : isUpdatingList
      ? "Saving..."
      : isEdit
        ? "Save"
        : "Create";

  async function submitList() {
    try {
      const curr = {
        title: listTitle,
        color: listColor,
      };

      const result = await onSubmitResult(isEdit, list, curr, onListSubmit);

      if (!result.success) {
        if (result.error === "duplicate") {
          setIsListDuplicate(true);
        }
        return;
      }
      onClose();
    } catch (error) {
      console.log("Error in ListModal.jsx");
      console.log(error);
    }
  }

  function handleColorKeyDown(e, index) {
    let nextIndex;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = (index + 1) % availableListColors.length;
        break;

      case "ArrowLeft":
      case "ArrowUp":
        nextIndex =
          (index - 1 + availableListColors.length) % availableListColors.length;
        break;

      default:
        return;
    }

    e.preventDefault();

    setListColor(availableListColors[nextIndex].value);
    colorRefs.current[nextIndex]?.focus();
  }

  return (
    <Modal
      header={isEdit ? "Edit list" : "Add new list"}
      onAction={async () => {
        await submitList();
      }}
      onClose={onClose}
      isLoading={isLoading}
      isEmpty={!listTitle.trim()}
      action={buttonContent}
      returnFocusRef={returnFocusRef}
    >
      <div className="flex h-20 w-full flex-col justify-evenly">
        <div className="flex h-10 w-full items-center rounded border-2 border-[#ebebeb]">
          <div
            className="mx-2 size-4 rounded"
            style={{ backgroundColor: listColor }}
          />
          <label htmlFor="list-title" className="sr-only">
            List title
          </label>
          <input
            id="list-title"
            type="text"
            value={listTitle}
            autoFocus
            required
            onChange={(e) => {
              setListTitle(e.target.value);
              setIsListDuplicate(false);
            }}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                await submitList();
              }
            }}
            className="h-full w-55 rounded-md px-2.5"
            aria-describedby={isEdit ? "edit-list-error" : "create-list-error"}
          />
        </div>
        <div
          role="radiogroup"
          className="mt-2.5 flex h-5 w-full items-center justify-evenly"
          aria-label="Choose list color"
        >
          {availableListColors.map((color, index) => (
            <button
              key={color.value}
              ref={(el) => (colorRefs.current[index] = el)}
              type="button"
              role="radio"
              tabIndex={listColor === color.value ? 0 : -1}
              onClick={() => setListColor(color.value)}
              onKeyDown={(e) => handleColorKeyDown(e, index)}
              className={`size-4 cursor-pointer rounded ${listColor === color.value && "outline outline-offset-6 outline-blue-600"} focus-visible:ring-2 focus-visible:ring-blue-600`}
              style={{ backgroundColor: color.value }}
              aria-label={`Select ${color.label} list color`}
              aria-checked={listColor === color.value}
            />
          ))}
        </div>
      </div>

      <p
        id={isEdit ? "edit-list-error" : "create-list-error"}
        role="alert"
        className={`mt-2.5 h-5 w-full text-center text-red-600 ${isListDuplicate ? "visible" : "invisible"}`}
      >
        This list already exists
      </p>
    </Modal>
  );
}

export default ListModal;
