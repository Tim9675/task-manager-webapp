import { useState } from "react";

import { useNotes } from "../../contexts/NotesContext";
import NoteCard from "./NoteCard";
import AddNoteButton from "./AddNoteButton";
import NoteInput from "./NoteInput";

function StickyWall() {
  const {
    userNotes,
    onCreateNote,
    onUpdateNote,
    onDeleteNote,
    isDeletingNote,
  } = useNotes();
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editNoteId, setEditNoteId] = useState(null);

  return (
    <div className="flex h-full flex-col py-5">
      <header className="mb-5 flex w-full px-5">
        <h1 className="ms-2.5 text-[2.5rem] font-bold">Sticky Wall</h1>
      </header>
      {/* Idk why main is tabable. Is <main> automatically tabable or is it because of grid? */}
      {/* I think it's overflowing content */}
      <div className="mx-5 grid grid-cols-1 gap-5 overflow-y-auto rounded border border-[#ebebeb] px-6 py-5 md:grid-cols-2 xl:grid-cols-3">
        {isAddingNote ? (
          <NoteInput
            mode="create"
            onClose={() => setIsAddingNote(false)}
            onNoteSubmit={onCreateNote}
          />
        ) : (
          <AddNoteButton
            onAdd={() => {
              setIsAddingNote(true);
              setEditNoteId(null);
            }}
          />
        )}

        {userNotes.map((note) => {
          if (note._id === editNoteId)
            return (
              <NoteInput
                key={note._id}
                mode="edit"
                note={note}
                onClose={() => setEditNoteId(null)}
                onNoteSubmit={onUpdateNote}
              />
            );
          return (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={() => {
                setEditNoteId(note._id);
                setIsAddingNote(false);
              }}
              onDelete={async () => await onDeleteNote(note._id)}
              isDeletingNote={isDeletingNote}
            />
          );
        })}
      </div>
    </div>
  );
}

export default StickyWall;
