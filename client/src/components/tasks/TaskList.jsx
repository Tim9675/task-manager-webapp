import TaskCard from "./TaskCard";
import AddTask from "./AddTask";

function TaskList({
  tasks,
  activeView,
  header,
  selectedTaskId,
  setSelectedTaskId,
  createTask,
  toggleTask,
  searchQuery,
  setIsTaskDetailsOpen,
  userLists,
}) {
  let remainingTasksCounter = 0;

  for (let task of tasks) {
    if (!task.checked) remainingTasksCounter++;
  }

  return (
    <div className="flex h-full grow flex-col py-5">
      {/* REMINDER: Make header font size adjust based on list title length */}
      <header className="mb-5 flex w-full px-5">
        <h3 className="ms-2.5 text-[2.5rem] font-bold">{header}</h3>
        {remainingTasksCounter > 0 && (
          <div className="ms-7.5 h-fit rounded-md border px-2.5 py-1 text-4xl">
            {remainingTasksCounter}
          </div>
        )}
      </header>
      {!searchQuery && (
        <AddTask
          key={`${activeView.type}-${activeView.id ?? ""}`}
          createTask={createTask}
        />
      )}
      <div className="mx-5 flex-1 overflow-y-auto">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              toggleTask={toggleTask}
              onSelect={() => {
                setSelectedTaskId(task.id);
                setIsTaskDetailsOpen(true);
              }}
              isSelected={selectedTaskId === task.id}
              listDetails={
                // REMINDER: This is inefficient, we should fetch list details when fetching tasks instead of searching through lists on every card render
                // ERROR: This causes a bug where if you add a task to a list, the task won't show the list color until you refresh or change views, because the list details aren't updated in the task card
                // REMINDER: We also need to do this for tags when we implement them, so we should probably just change our data structure to include list and tag details in the task object when we fetch tasks
                userLists.find((list) => list.id === task.listId) || null
              }
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
