import { useContext, useState } from "react";
import { TagsContext } from "../../contexts/TagsContext";

function TagModal({ mode, tag = {}, onTagSubmit, onClose }) {
  const [tagTitle, setTagTitle] = useState(mode === "edit" ? tag.title : "");
  const [tagColor, setTagColor] = useState(
    mode === "edit" ? tag.color : "#d1eaed",
  );
  const [isTagDuplicate, setIsTagDuplicate] = useState(false);

  const { availableTagColors, isCreatingTag, isUpdatingTag } =
    useContext(TagsContext);

  async function submitTag() {
    let result;
    try {
      switch (mode) {
        case "create":
          result = await onTagSubmit(tagTitle, tagColor);
          break;
        case "edit":
          result = await onTagSubmit({
            _id: tag._id,
            title: tagTitle,
            color: tagColor,
          });
          break;
        default:
          result = { success: false, error: "Error in TagModal.jsx" };
      }
      if (!result.success && result.error === "duplicate") {
        setIsTagDuplicate(true);
        return;
      }
      onClose();
    } catch (error) {
      console.log("Error in TagModal.jsx");
      console.log(error);
    }
  }

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
          <h2 className="text-lg font-semibold text-neutral-800">
            {mode === "create" ? "Add New Tag" : "Edit Tag"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-sm text-neutral-500 hover:text-neutral-700"
          >
            ✕
          </button>
        </div>

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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submitTag();
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

        {/* Footer */}
        <div className="mt-4 flex justify-evenly">
          <button
            type="button"
            onClick={onClose}
            disabled={isCreatingTag || isUpdatingTag}
            className="cursor-pointer rounded-md bg-[#f5f5f5] px-4 py-2 text-sm font-medium hover:brightness-95 disabled:cursor-not-allowed disabled:hover:brightness-100"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!tagTitle.trim() || isCreatingTag || isUpdatingTag}
            onClick={submitTag}
            className="cursor-pointer rounded-md bg-[#ffd43b] px-4 py-2 text-sm font-medium hover:brightness-95 disabled:cursor-not-allowed disabled:bg-[#bbbbbb] disabled:hover:brightness-100"
          >
            {mode === "create" ? "Create" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TagModal;
