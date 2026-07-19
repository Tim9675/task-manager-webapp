import { useState } from "react";

import { useNotes } from "../../contexts/NotesContext";
import NoteCard from "./NoteCard";
import AddNoteButton from "./AddNoteButton";
import NoteInput from "./NoteInput";

function StickyWall() {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editNoteId, setEditNoteId] = useState(null);
  const { userNotes, onCreateNote, onUpdateNote } = useNotes();

  function renderNotes() {
    return userNotes.map((note) => {
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
        />
      );
    });
  }

  return (
    <div className="flex h-full flex-col py-5">
      <header className="mb-5 flex w-full px-5">
        <h1 id="sticky-wall-heading" className="ms-2.5 text-[2.5rem] font-bold">
          Sticky Wall
        </h1>
      </header>

      <section
        className="mx-5 grid grid-cols-1 gap-5 overflow-y-auto rounded border border-[#ebebeb] px-6 py-5 md:grid-cols-2 xl:grid-cols-3"
        aria-labelledby="sticky-wall-heading"
      >
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

        {userNotes.length === 0 ? (
          <p className="col-span-full self-center justify-self-center text-neutral-500">
            📝 No notes yet.
          </p>
        ) : (
          renderNotes()
        )}
      </section>
    </div>
  );
}

export default StickyWall;
