import SidebarItem from "./SidebarItem";
import AddList from "./AddList";
import AddTag from "./AddTag";

function SidebarSection({ title, type, navList = [], setActiveView }) {
  return (
    <section className="mb-5">
      <h2 className="mb-1 ps-3 text-xs text-neutral-500 uppercase">{title}</h2>
      {type === "tags" ? (
        <nav className="flex w-full flex-wrap gap-1">
          {navList.map((nav) => (
            <SidebarItem
              key={nav.id}
              nav={nav}
              type={type}
              setActiveView={setActiveView}
            />
          ))}
          <AddTag />
        </nav>
      ) : (
        <nav className="flex flex-col">
          {navList.map((nav) => (
            <SidebarItem
              key={nav.id}
              nav={nav}
              type={type}
              setActiveView={setActiveView}
            />
          ))}
        </nav>
      )}

      {type === "lists" && <AddList />}
      {type !== "tags" && <hr className="mx-auto mt-4 w-64 border-[#ebebeb]" />}
    </section>
  );
}

export default SidebarSection;
