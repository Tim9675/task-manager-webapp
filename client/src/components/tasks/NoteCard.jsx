import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import Modal from "../modals/Modal";

function NoteCard({ note, onEdit, onDelete, isDeletingNote }) {
  const [isDeleteNoteOpen, setIsDeleteNoteOpen] = useState(false);
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

            <div className="invisible flex w-20 justify-evenly group-focus-within:visible group-hover:visible group-focus-visible:visible">
              <button
                type="button"
                className="flex aspect-square size-7.5 cursor-pointer items-center justify-center rounded text-[#7c7c7c] hover:text-blue-600"
                onClick={onEdit}
                aria-label={`Edit note "${note.title}"`}
              >
                <Pencil size={iconSize} />
              </button>
              <button
                type="button"
                className="flex aspect-square size-7.5 cursor-pointer items-center justify-center rounded text-[#7c7c7c] hover:text-red-600"
                onClick={() => setIsDeleteNoteOpen(true)}
                aria-label={`Delete note "${note.title}"`}
              >
                <Trash2 size={iconSize} />
              </button>
            </div>
          </div>

          <pre className="text-wrap text-[#444444]">{note.content}</pre>
        </div>
      </article>
      <Modal
        isOpen={isDeleteNoteOpen}
        header="Warning!"
        onAction={async () => {
          await onDelete();
          setIsDeleteNoteOpen(false);
        }}
        onClose={() => setIsDeleteNoteOpen(false)}
        isLoading={isDeletingNote}
        action={isDeletingNote ? "Deleting..." : "Delete"}
      >
        <p className="my-5 text-center">
          Delete the note titled '{noteTitle}'?
        </p>
      </Modal>
    </>
  );
}

export default NoteCard;
