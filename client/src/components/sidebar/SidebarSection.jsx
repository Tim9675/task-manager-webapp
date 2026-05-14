import SidebarItem from "./SidebarItem";

function SidebarSection({ title, type, navList = [] }) {
  return (
    <section className="mb-5">
      <h2 className="mb-1 ps-3 text-xs text-neutral-500 uppercase">{title}</h2>

      {type === "tags" ? (
        <nav className="flex flex-wrap gap-2 px-3">
          {navList.map((nav) => (
            <SidebarItem key={nav.id} nav={nav} type={type} />
          ))}
        </nav>
      ) : (
        <nav className="flex flex-col">
          {navList.map((nav) => (
            <SidebarItem key={nav.id} nav={nav} type={type} />
          ))}
        </nav>
      )}

      {type !== "tags" && <hr className="mx-auto mt-4 w-64 border-[#ebebeb]" />}
    </section>
  );
}

export default SidebarSection;
