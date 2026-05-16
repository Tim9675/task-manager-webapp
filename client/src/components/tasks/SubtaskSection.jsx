import AddSubtask from "./AddSubtask";
import SubtaskCard from "./SubtaskCard";

function SubtaskSection() {
  // REMINDERL: This later comes from task.subtasks prop
  const subtasks = [
    {
      id: 0,
      title: "Subtask 1",
      checked: false,
    },
    {
      id: 1,
      title: "Subtask 2",
      checked: true,
    },
    {
      id: 2,
      title: "Subtask 3",
      checked: false,
    },
  ];

  return (
    <div className="my-2 flex w-full flex-col">
      <h2 className="text-xl font-bold text-neutral-900">Subtasks:</h2>
      <AddSubtask />
      <div className="h-50 overflow-y-auto rounded-md border border-[#ebebeb]">
        {subtasks.map((subtask) => (
          <SubtaskCard key={subtask.id} subtask={subtask} />
        ))}
      </div>
    </div>
  );
}

export default SubtaskSection;
