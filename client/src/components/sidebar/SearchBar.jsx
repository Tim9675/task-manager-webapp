import { useRef } from "react";
import { Search, X } from "lucide-react";

import { useDisplay } from "../../contexts/DisplayContext";

function SearchBar() {
  const inputRef = useRef(null);
  const { searchQuery, setSearchQuery, setIsSearching } = useDisplay();

  return (
    <div className="relative mt-3 mb-6 flex w-full items-center rounded-md border border-[#ebebeb] px-3 focus-within:border-neutral-300 md:h-9">
      <Search color="#7c7c7c" size={16} strokeWidth={4} />
      <label htmlFor="task-search-bar" className="sr-only">
        Search tasks by title
      </label>
      <input
        id="task-search-bar"
        type="search"
        ref={inputRef}
        value={searchQuery}
        onChange={(e) => {
          const value = e.target.value;

          setSearchQuery(value);
          setIsSearching(value !== "");
        }}
        className="ms-3 flex-1 bg-transparent text-sm outline-none"
        placeholder="Search"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={() => {
            setSearchQuery("");
            setIsSearching(false);
            inputRef.current?.focus();
          }}
          className="absolute right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded hover:bg-neutral-200"
          aria-label="Clear search"
        >
          <X color="#7c7c7c" size={16} strokeWidth={4} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
