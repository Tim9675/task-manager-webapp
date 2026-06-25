import { useState, useContext } from "react";

import { NotesContext } from "../../contexts/NotesContext";

function NoteInput({ mode, note = {}, onClose, onNoteSubmit }) {
  const [noteTitle, setNoteTitle] = useState(note?.title ?? "");
  const [noteContent, setNoteContent] = useState(note?.content ?? "");
  const [noteColor, setNoteColor] = useState(note?.color ?? "#d1eaed");

  const [isNoteDuplicate, setIsNoteDuplicate] = useState(false);

  const { availableNoteColors, isCreatingNote, isUpdatingNote } =
    useContext(NotesContext);

  async function submitNote() {
    let result;
    try {
      switch (mode) {
        case "create":
          result = await onNoteSubmit(noteTitle, noteContent, noteColor);
          break;
        case "edit":
          result = await onNoteSubmit({
            _id: note._id,
            title: noteTitle,
            content: noteContent,
            color: noteColor,
          });
          break;
        default:
          result = { success: false, error: "Error in NoteInput.jsx" };
      }
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

  return (
    <div
      className="aspect-square w-full rounded-lg p-5"
      style={{ backgroundColor: noteColor }}
    >
      <div className="h-full overflow-y-auto">
        <div className="flex flex-col justify-start gap-2">
          <input
            name="noteTitle"
            className="mb-0.5 rounded-md border border-[#7c7c7c] px-1 text-[1.25rem] font-semibold"
            value={noteTitle}
            onChange={(e) => {
              setNoteTitle(e.target.value);
              setIsNoteDuplicate(false);
            }}
            autoFocus
          />
          <textarea
            name="noteContent"
            className="h-37.5 rounded-md border border-[#7c7c7c] px-1 text-wrap text-[#444444]"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
          >
            {noteContent}
          </textarea>
          <div className="flex h-10 items-center justify-evenly rounded bg-[#f5f5f5]">
            {availableNoteColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setNoteColor(color)}
                className={`size-4 cursor-pointer rounded ${noteColor === color && "outline outline-offset-6 outline-[#ebebeb]"}`}
                style={{ backgroundColor: color }}
              ></button>
            ))}
          </div>
          <div className="mt-0.5 h-5 w-full text-center text-red-600">
            {isNoteDuplicate && "This note already exists."}
          </div>
          {/* Footer */}
          <div className="flex h-10 items-center justify-between gap-7.5">
            <button
              type="button"
              disabled={isCreatingNote || isUpdatingNote}
              className="h-full flex-1 cursor-pointer rounded-md border border-[#dddddd] bg-[#f5f5f5] hover:brightness-95 disabled:cursor-not-allowed disabled:bg-[#bbbbbb] disabled:hover:brightness-100"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!noteTitle.trim() || isCreatingNote || isUpdatingNote}
              className="h-full flex-1 cursor-pointer rounded-md bg-[#ffd43b] hover:brightness-95 disabled:cursor-not-allowed disabled:bg-[#bbbbbb] disabled:hover:brightness-100"
              onClick={submitNote}
            >
              {mode === "create" ? "Add" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoteInput;
