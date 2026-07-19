import { useState, useRef } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { useNotes } from "../../contexts/NotesContext";
import Modal from "../modals/Modal";

function NoteCard({ note, onEdit }) {
  const [isDeleteNoteOpen, setIsDeleteNoteOpen] = useState(false);
  const returnFocusRef = useRef(null);

  const { onDeleteNote, isDeletingNote } = useNotes();
  const noteTitle = note?.title ?? "Missing note title";

  const iconSize = 20;
  return (
    <>
      <article
        className="group aspect-square w-full rounded-lg p-5"
        tabIndex={0}
        style={{ backgroundColor: note.color }}
      >
        <div className="h-full overflow-y-auto" tabIndex={-1}>
          <div className="mb-3 flex items-start justify-between gap-2 pt-1">
            <h2 className="line-clamp-2 text-[1.25rem] font-semibold">
              {note.title}
            </h2>

            <div className="flex w-20 justify-evenly">
              <button
                type="button"
                className="flex aspect-square size-7.5 cursor-pointer items-center justify-center rounded text-[#7c7c7c] hover:text-blue-600 focus:text-blue-600"
                onClick={onEdit}
                aria-label={`Edit note "${note.title}"`}
              >
                <Pencil size={iconSize} />
              </button>
              <button
                type="button"
                className="flex aspect-square size-7.5 cursor-pointer items-center justify-center rounded text-[#7c7c7c] hover:text-red-600 focus:text-red-600"
                onClick={() => {
                  setIsDeleteNoteOpen(true);
                  returnFocusRef.current = document.activeElement;
                }}
                aria-label={`Delete note "${note.title}"`}
              >
                <Trash2 size={iconSize} />
              </button>
            </div>
          </div>

          <pre className="text-wrap text-[#444444]">{note.content}</pre>
        </div>
      </article>
      {isDeleteNoteOpen && (
        <Modal
          header="Warning!"
          onAction={async () => {
            await onDeleteNote(note._id);
            setIsDeleteNoteOpen(false);
          }}
          onClose={() => setIsDeleteNoteOpen(false)}
          isLoading={isDeletingNote}
          action={isDeletingNote ? "Deleting..." : "Delete"}
          returnFocusRef={returnFocusRef}
          descriptionId={"delete-note-description"}
        >
          <p id="delete-note-description" className="my-5 text-center">
            Delete the note titled '{noteTitle}'?
          </p>
        </Modal>
      )}
    </>
  );
}

export default NoteCard;
