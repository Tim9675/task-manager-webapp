import { useState } from "react";

import { useLists } from "../../contexts/ListsContext";
import Modal from "../modals/Modal";

function ListModal({ isOpen, mode, list = {}, onListSubmit, onClose }) {
  if (!isOpen) return null;

  const [listTitle, setListTitle] = useState(mode === "edit" ? list.title : "");
  const [listColor, setListColor] = useState(
    mode === "edit" ? list.color : "#ff6b6b",
  );
  const [isListDuplicate, setIsListDuplicate] = useState(false);

  const { availableListColors, isCreatingList, isUpdatingList } = useLists();

  const isLoading = isCreatingList || isUpdatingList;

  const buttonContent = isCreatingList
    ? "Creating..."
    : isUpdatingList
      ? "Saving..."
      : mode === "edit"
        ? "Save"
        : "Create";

  async function submitList() {
    let result;
    try {
      switch (mode) {
        case "create":
          result = await onListSubmit(listTitle, listColor);
          break;
        case "edit":
          result = await onListSubmit({
            _id: list._id,
            title: listTitle,
            color: listColor,
          });
          break;
        default:
          result = { success: false, error: "Error in ListModal.jsx" };
      }
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

  return (
    <Modal
      isOpen={true}
      header={mode === "create" ? "Add new list" : "Edit list"}
      onAction={async () => {
        await submitList();
      }}
      onClose={onClose}
      isLoading={isLoading}
      isEmpty={!listTitle.trim()}
      action={buttonContent}
    >
      {/* Toggle hide completed tasks */}
      <div className="flex h-20 w-full flex-col justify-evenly">
        <div className="flex h-10 w-full items-center rounded border-2 border-[#ebebeb]">
          <div
            className="mx-2 size-4 rounded"
            style={{ backgroundColor: listColor }}
          ></div>
          <input
            type="text"
            value={listTitle}
            autoFocus
            onChange={(e) => {
              setListTitle(e.target.value);
              setIsListDuplicate(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submitList();
              }
            }}
            className="h-full w-55 rounded-md px-2.5"
          />
        </div>
        <div className="mt-2.5 flex h-5 w-full items-center justify-evenly">
          {availableListColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setListColor(color)}
              className={`size-4 cursor-pointer rounded ${listColor === color && "outline outline-offset-6 outline-[#ebebeb]"}`}
              style={{ backgroundColor: color }}
            ></button>
          ))}
        </div>
      </div>

      <div className="mt-2.5 h-5 w-full text-center text-red-600">
        {isListDuplicate && "This list already exists."}
      </div>
    </Modal>
  );
}

export default ListModal;
