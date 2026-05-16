import SidebarItem from "../sidebar/SidebarItem";
import AddTaskTags from "./AddTaskTags";

function TagSection() {
  const taskTags = [
    {
      id: 0,
      title: "Tag 1",
      color: "#d1eaed",
    },
  ];
  return (
    <div className="flex h-20 w-full items-start justify-between">
      <label htmlFor="tags" className="my-2 text-sm">
        Tags
      </label>
      <div className="flex max-h-20 flex-wrap gap-1 overflow-y-auto rounded-md border border-[#ebebeb] md:w-65">
        {taskTags.map((tag) => (
          <SidebarItem key={tag.id} nav={tag} type={"tags"} />
        ))}
        <AddTaskTags />
      </div>
    </div>
  );
}

export default TagSection;
