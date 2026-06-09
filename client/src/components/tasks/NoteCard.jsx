import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

function NoteCard({ note, onClose }) {
  const [noteTitle, setNoteTitle] = useState(note?.title ?? "");
  const [noteContent, setNoteContent] = useState(note?.content ?? "");
  const [noteColor, setNoteColor] = useState(note?.color ?? "#d1eaed");

  const iconSize = 20;
  const iconColor = "#7c7c7c";
  return (
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
              className="flex aspect-square size-7.5 cursor-pointer items-center justify-center rounded hover:bg-[#ebebeb]"
            >
              <Pencil size={iconSize} color={iconColor} />
            </button>
            <button
              type="button"
              className="flex aspect-square size-7.5 cursor-pointer items-center justify-center rounded hover:bg-[#ebebeb]"
            >
              <Trash2 size={iconSize} color={iconColor} />
            </button>
          </div>
        </div>

        <pre className="text-wrap text-[#444444]">{note.content}</pre>
      </div>
    </div>
  );
}

export default NoteCard;
