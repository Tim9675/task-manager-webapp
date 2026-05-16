import TaskCard from "./TaskCard";
import AddTask from "./AddTask";

function TaskList() {
  const tasks = [
    {
      id: 0,
      title: "Research content ideas",
      description: "",
      dueDate: new Date(Date.now()),
      listId: null,
      tagIds: [],
      subtasks: [],
      checked: false,
    },
    {
      id: 1,
      title: "Create a database of guest authors",
      description: "",
      dueDate: new Date(Date.now()),
      listId: null,
      tagIds: [],
      subtasks: [],
      checked: false,
    },
    {
      id: 2,
      title: "Renew driver's license",
      description: "",
      dueDate: new Date(Date.now()),
      listId: null,
      tagIds: [],
      subtasks: [
        {
          id: 0,
          title: "Subtask 1",
          checked: false,
        },
      ],
      checked: false,
    },
    {
      id: 3,
      title: "Consult accountant",
      description: "",
      dueDate: new Date(Date.now()),
      listId: null,
      tagIds: [],
      subtasks: [
        {
          id: 0,
          title: "Subtask 1",
          checked: false,
        },
        {
          id: 1,
          title: "Subtask 2",
          checked: false,
        },
        {
          id: 2,
          title: "Subtask 3",
          checked: false,
        },
      ],
      checked: false,
    },
    {
      id: 4,
      title: "Print business card",
      description: "",
      dueDate: new Date(Date.now()),
      listId: null,
      tagIds: [],
      subtasks: [],
      checked: false,
    },
  ];

  const type = "Today";

  return (
    <main className="flex h-full grow flex-col py-5">
      <header className="mb-5 flex w-full px-5">
        <h3 className="text-[2.5rem] font-bold">{type}</h3>
        <div className="ms-7.5 h-fit rounded-md border px-2.5 py-1 text-4xl">
          {tasks.length}
        </div>
      </header>
      <AddTask />
      <div className="mx-5 flex-1 overflow-y-auto">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </main>
  );
}

export default TaskList;
