import { useState, useRef } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { useNotes } from "../../contexts/NotesContext";
import DeleteItemModal from "../modals/DeleteItemModal";

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
              {noteTitle}
            </h2>

            <div className="flex w-20 justify-evenly">
              <button
                type="button"
                className="flex aspect-square size-7.5 cursor-pointer items-center justify-center rounded text-[#7c7c7c] hover:text-blue-600 focus:text-blue-600"
                onClick={onEdit}
                aria-label={`Edit note "${noteTitle}"`}
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
                aria-label={`Delete note "${noteTitle}"`}
              >
                <Trash2 size={iconSize} />
              </button>
            </div>
          </div>

          <pre className="text-wrap text-[#444444]">{note.content}</pre>
        </div>
      </article>
      {isDeleteNoteOpen && (
        <DeleteItemModal
          itemType="note"
          title={noteTitle}
          onDelete={async () => {
            await onDeleteNote(note._id);
            setIsDeleteNoteOpen(false);
          }}
          isDeleting={isDeletingNote}
          onClose={() => setIsDeleteNoteOpen(false)}
          descriptionId="delete-note-description"
          returnFocusRef={returnFocusRef}
        />
      )}
    </>
  );
}

export default NoteCard;
