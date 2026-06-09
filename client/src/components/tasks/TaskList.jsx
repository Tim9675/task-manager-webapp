import { useContext } from "react";

import TaskCard from "./TaskCard";
import AddTask from "./AddTask";
import { ListsContext } from "../../contexts/ListsContext";
import { TasksContext } from "../../contexts/TasksContext";
import Upcoming from "./Upcoming";

function TaskList({ tasks, activeView, header, searchQuery }) {
  let remainingTasksCounter = 0;

  for (let task of tasks) {
    if (!task.checked) remainingTasksCounter++;
  }

  const { getListById } = useContext(ListsContext);
  const { openTask } = useContext(TasksContext);

  return (
    <div className="flex h-full grow flex-col py-5">
      <header className="mb-5 flex w-full px-5">
        <h3 className="ms-2.5 text-[2.5rem] font-bold">{header}</h3>
        {remainingTasksCounter > 0 && (
          <div className="ms-7.5 h-fit rounded-md border px-2.5 py-1 text-4xl">
            {remainingTasksCounter}
          </div>
        )}
      </header>
      {activeView.type === "upcoming" ? (
        <Upcoming tasks={tasks} />
      ) : (
        <>
          {/* REMINDER: Make header font size adjust based on list title length */}
          {!searchQuery && (
            <AddTask
              key={`${activeView.type}-${activeView.id ?? ""}`}
              activeView={activeView}
            />
          )}
          <div className="mx-5 flex-1 overflow-y-auto">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onSelect={() => openTask(task.id)}
                  // Tag condition in case a tag has same id as list
                  listDetails={
                    activeView.type !== "tag" &&
                    activeView.id !== task.listId &&
                    getListById(task.listId)
                  }
                />
              ))
            ) : (
              <p className="my-2.5 w-full text-center">
                No items match your search.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default TaskList;
