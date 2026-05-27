import { Search } from "lucide-react";

function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="mt-3 mb-6 flex w-full items-center rounded-md border border-[#ebebeb] px-3 focus-within:border-neutral-300 md:h-9">
      <Search color="#7c7c7c" size={16} strokeWidth={4} />
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search"
        className="ms-3 flex-1 bg-transparent text-sm outline-none"
      />
    </div>
  );
}

export default SearchBar;
