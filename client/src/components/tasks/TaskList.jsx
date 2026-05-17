import TaskCard from "./TaskCard";
import AddTask from "./AddTask";

function TaskList({
  tasks,
  setTasks,
  selectedTaskId,
  setSelectedTaskId,
  createTask,
}) {
  const type = "Today";

  return (
    <div className="flex h-full grow flex-col py-5">
      <header className="mb-5 flex w-full px-5">
        <h3 className="text-[2.5rem] font-bold">{type}</h3>
        {tasks.length > 0 && (
          <div className="ms-7.5 h-fit rounded-md border px-2.5 py-1 text-4xl">
            {tasks.length}
          </div>
        )}
      </header>
      <AddTask createTask={createTask} />
      <div className="mx-5 flex-1 overflow-y-auto">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            setTasks={setTasks}
            onSelect={() => setSelectedTaskId(task.id)}
            isSelected={selectedTaskId === task.id}
          />
        ))}
      </div>
    </div>
  );
}

export default TaskList;
