import TaskCard from "./TaskCard";
import AddTask from "./AddTask";

function TaskList({
  tasks,
  activeView,
  setTasks,
  selectedTaskId,
  setSelectedTaskId,
  createTask,
  searchQuery,
}) {
  function renderHeader() {
    if (searchQuery) return "Search results";
    switch (activeView.type) {
      case "upcoming":
        return "Upcoming";
      case "list":
        return activeView.title;
      case "tag":
        return activeView.title;
      default:
        return "Today";
    }
  }

  return (
    <div className="flex h-full grow flex-col py-5">
      {/* REMINDER: Make header font size adjust based on list title length */}
      <header className="mb-5 flex w-full px-5">
        <h3 className="ms-2.5 text-[2.5rem] font-bold">{renderHeader()}</h3>
        {tasks.length > 0 && (
          <div className="ms-7.5 h-fit rounded-md border px-2.5 py-1 text-4xl">
            {tasks.length}
          </div>
        )}
      </header>
      {!searchQuery && <AddTask createTask={createTask} />}
      <div className="mx-5 flex-1 overflow-y-auto">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              setTasks={setTasks}
              onSelect={() => setSelectedTaskId(task.id)}
              isSelected={selectedTaskId === task.id}
            />
          ))
        ) : (
          <p className="my-2.5 w-full text-center">
            No items match your search.
          </p>
        )}
      </div>
    </div>
  );
}

export default TaskList;
