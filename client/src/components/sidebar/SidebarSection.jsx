import SidebarItem from "./SidebarItem";
import AddList from "./AddList";
import AddTag from "./AddTag";

function SidebarSection({ title, type, navList = [], onOpen }) {
  const headingId = `${type}-heading`;

  return (
    <section className="mb-5" aria-labelledby={headingId}>
      <header>
        <h2
          id={headingId}
          className="mb-1 ps-3 text-xs text-neutral-500 uppercase"
        >
          {title}
        </h2>
      </header>

      {type === "tags" ? (
        <>
          <nav>
            <ul className="mb-2 flex w-full flex-wrap gap-1">
              {navList.map((nav) => (
                <li key={nav._id}>
                  <SidebarItem nav={nav} type={type} />
                </li>
              ))}
            </ul>
          </nav>
          <AddTag onOpen={onOpen} />
        </>
      ) : (
        <nav className="flex flex-col">
          <ul>
            {navList.map((nav) => (
              <li key={nav._id}>
                <SidebarItem nav={nav} type={type} />
              </li>
            ))}
          </ul>
        </nav>
      )}

      {type === "lists" && <AddList onOpen={onOpen} />}
      {type !== "tags" && <hr className="mx-auto mt-4 w-64 border-[#ebebeb]" />}
    </section>
  );
}

export default SidebarSection;
