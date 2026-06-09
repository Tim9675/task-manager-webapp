import { useContext } from "react";
import { NotesContext } from "../../contexts/NotesContext";
import NoteCard from "./NoteCard";

function StickyWall() {
  const { userNotes } = useContext(NotesContext);
  return (
    <div className="flex h-full flex-col py-5">
      <header className="mb-5 flex w-full px-5">
        <h3 className="ms-2.5 text-[2.5rem] font-bold">Sticky Wall</h3>
      </header>
      {/* Idk why main is tabable. Is <main> automatically tabable or is it because of grid? */}
      <div className="mx-5 grid grid-cols-1 gap-5 overflow-y-auto rounded border border-[#ebebeb] px-6 py-5 md:grid-cols-2 xl:grid-cols-3">
        {userNotes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
}

export default StickyWall;
