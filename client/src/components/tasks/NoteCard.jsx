import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import DeleteNoteModal from "./DeleteNoteModal";

function NoteCard({ note, onEdit, onDelete }) {
  const noteTitle = note?.title ?? "Missing note title";
  const [isDeleteNoteOpen, setIsDeleteNoteOpen] = useState(false);

  const iconSize = 20;
  return (
    <>
      <div
        className="aspect-square w-full rounded-lg p-5"
        style={{ backgroundColor: note.color }}
      >
        <div className="h-full overflow-y-auto">
          <div className="group mb-3 flex items-start justify-between gap-2">
            <h4 className="line-clamp-2 text-[1.25rem] font-semibold">
              {note.title}
            </h4>
            <div className="invisible flex w-20 justify-evenly group-hover:visible">
              <button
                type="button"
                className="flex aspect-square size-7.5 cursor-pointer items-center justify-center rounded text-[#7c7c7c] hover:text-blue-600"
                onClick={onEdit}
              >
                <Pencil size={iconSize} />
              </button>
              <button
                type="button"
                className="flex aspect-square size-7.5 cursor-pointer items-center justify-center rounded text-[#7c7c7c] hover:text-red-600"
                onClick={() => setIsDeleteNoteOpen(true)}
              >
                <Trash2 size={iconSize} />
              </button>
            </div>
          </div>

          <pre className="text-wrap text-[#444444]">{note.content}</pre>
        </div>
      </div>
      {isDeleteNoteOpen && (
        <DeleteNoteModal
          noteTitle={noteTitle}
          onClose={() => setIsDeleteNoteOpen(false)}
          onDelete={async () => await onDelete()}
        />
      )}
    </>
  );
}

export default NoteCard;
