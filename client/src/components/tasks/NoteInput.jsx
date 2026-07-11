import { useState, useRef } from "react";

import { useNotes } from "../../contexts/NotesContext";
import { onSubmitResult } from "../helpers/onSubmitResult";

function NoteInput({ mode, note = {}, onClose, onNoteSubmit }) {
  const [noteTitle, setNoteTitle] = useState(note?.title ?? "");
  const [noteContent, setNoteContent] = useState(note?.content ?? "");
  const [noteColor, setNoteColor] = useState(note?.color ?? "#d1eaed");
  const [isNoteDuplicate, setIsNoteDuplicate] = useState(false);

  const colorRefs = useRef([]);

  const { availableNoteColors, isCreatingNote, isUpdatingNote } = useNotes();

  const isEdit = mode === "edit";
  const isLoading = isCreatingNote || isUpdatingNote;

  const buttonContent = isCreatingNote
    ? "Creating..."
    : isUpdatingNote
      ? "Saving..."
      : isEdit
        ? "Save"
        : "Create";

  async function submitNote(e) {
    e.preventDefault();
    try {
      const curr = {
        title: noteTitle,
        content: noteContent,
        color: noteColor,
      };

      const result = await onSubmitResult(isEdit, note, curr, onNoteSubmit);

      if (!result.success) {
        if (result.error === "duplicate") {
          setIsNoteDuplicate(true);
        }
        return;
      }
      onClose();
    } catch (error) {
      console.log("Error in submitNote");
      console.log(error);
    }
  }

  function handleColorKeyDown(e, index) {
    let nextIndex = index;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = (index + 1) % availableNoteColors.length;
        break;

      case "ArrowLeft":
      case "ArrowUp":
        nextIndex =
          (index - 1 + availableNoteColors.length) % availableNoteColors.length;
        break;

      default:
        return;
    }

    e.preventDefault();

    setNoteColor(availableNoteColors[nextIndex].value);
    colorRefs.current[nextIndex]?.focus();
  }

  return (
    <div
      className="aspect-square rounded-lg p-5"
      style={{ backgroundColor: noteColor }}
    >
      <div className="h-full overflow-y-auto">
        <form
          onSubmit={submitNote}
          className="flex flex-col justify-start gap-2"
        >
          <label htmlFor="note-title" className="sr-only">
            Note Title
          </label>
          <input
            id="note-title"
            type="text"
            name="noteTitle"
            value={noteTitle}
            autoFocus
            required
            className="mb-0.5 rounded-md border border-[#7c7c7c] px-1 text-[1.25rem] font-semibold"
            onChange={(e) => {
              setNoteTitle(e.target.value);
              setIsNoteDuplicate(false);
            }}
            aria-describedby={isEdit ? "edit-note-error" : "create-note-error"}
          />

          <label htmlFor="note-content" className="sr-only">
            Note Content
          </label>
          <textarea
            id="note-content"
            name="noteContent"
            value={noteContent}
            rows={8}
            className="h-37.5 rounded-md border border-[#7c7c7c] px-1 text-wrap text-[#444444]"
            onChange={(e) => setNoteContent(e.target.value)}
            aria-describedby={isEdit ? "edit-note-error" : "create-note-error"}
          />

          <div
            role="radiogroup"
            className="flex h-10 items-center justify-evenly rounded-md bg-[#f5f5f5]"
            aria-label="Choose note color"
          >
            {availableNoteColors.map((color, index) => (
              <button
                key={color.value}
                ref={(el) => (colorRefs.current[index] = el)}
                type="button"
                role="radio"
                tabIndex={noteColor === color.value ? 0 : -1}
                onClick={() => setNoteColor(color.value)}
                onKeyDown={(e) => handleColorKeyDown(e, index)}
                className={`size-4 cursor-pointer rounded ${noteColor === color.value && "outline outline-offset-6 outline-blue-600"} focus-visible:ring-2 focus-visible:ring-blue-600`}
                style={{ backgroundColor: color.value }}
                aria-label={`Select ${color.label} note color`}
                aria-checked={noteColor === color.value}
              />
            ))}
          </div>

          <p
            id={isEdit ? "edit-note-error" : "create-note-error"}
            className={`mt-0.5 h-5 w-full text-center text-red-600 ${isNoteDuplicate ? "visible" : "invisible"}`}
            role="alert"
          >
            This note already exists.
          </p>

          {/* Footer */}
          <div className="flex h-10 items-center justify-between gap-7.5">
            <button
              type="button"
              disabled={isLoading}
              className="h-full flex-1 cursor-pointer rounded-md border border-[#dddddd] bg-[#f5f5f5] hover:brightness-95 disabled:cursor-not-allowed disabled:bg-[#bbbbbb] disabled:hover:brightness-100"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!noteTitle.trim() || isLoading}
              className="h-full flex-1 cursor-pointer rounded-md bg-[#ffd43b] hover:brightness-95 disabled:cursor-not-allowed disabled:bg-[#bbbbbb] disabled:hover:brightness-100"
            >
              {buttonContent}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NoteInput;
