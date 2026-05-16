import TaskCard from "./TaskCard";
import AddTask from "./AddTask";

function TaskList({ setSelectedTask, selectedTaskId }) {
  const tasks = [
    {
      id: 0,
      title: "Research content ideas",
      description: "Description 1",
      dueDate: new Date(Date.now()),
      listId: null,
      tagIds: [],
      subtasks: [],
      checked: false,
    },
    {
      id: 1,
      title: "Create a database of guest authors",
      description: "Description 2",
      dueDate: new Date(Date.now()),
      listId: null,
      tagIds: [],
      subtasks: [],
      checked: true,
    },
    {
      id: 2,
      title: "Renew driver's license",
      description: "Description 3",
      dueDate: new Date(Date.now()),
      listId: 0,
      tagIds: [0],
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
      description: "Description 4",
      dueDate: new Date(Date.now()),
      listId: 2,
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
          checked: true,
        },
        {
          id: 2,
          title: "Subtask 3",
          checked: false,
        },
      ],
      checked: true,
    },
    {
      id: 4,
      title: "Print business card",
      description: "Description 5",
      dueDate: new Date(Date.now()),
      listId: null,
      tagIds: [],
      subtasks: [],
      checked: false,
    },
  ];

  const type = "Today";

  return (
    <div className="flex h-full grow flex-col py-5">
      <header className="mb-5 flex w-full px-5">
        <h3 className="text-[2.5rem] font-bold">{type}</h3>
        <div className="ms-7.5 h-fit rounded-md border px-2.5 py-1 text-4xl">
          {tasks.length}
        </div>
      </header>
      <AddTask />
      <div className="mx-5 flex-1 overflow-y-auto">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onSelect={() => setSelectedTask(task)}
            isSelected={selectedTaskId === task.id}
          />
        ))}
      </div>
    </div>
  );
}

export default TaskList;
