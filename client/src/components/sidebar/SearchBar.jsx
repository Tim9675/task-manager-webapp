import { Search } from "lucide-react";

import { useDisplay } from "../../contexts/DisplayContext";

function SearchBar() {
  const { searchQuery, setSearchQuery, setIsSearching } = useDisplay();

  // REMINDER: Optional, but add an "x" button that resets the search query
  return (
    <div className="mt-3 mb-6 flex w-full items-center rounded-md border border-[#ebebeb] px-3 focus-within:border-neutral-300 md:h-9">
      <Search color="#7c7c7c" size={16} strokeWidth={4} />
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          if (e.target.value === "") {
            setIsSearching(false);
            return;
          }
          setIsSearching(true);
        }}
        placeholder="Search"
        className="ms-3 flex-1 bg-transparent text-sm outline-none"
      />
    </div>
  );
}

export default SearchBar;
