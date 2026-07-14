import { useMemo } from "react";

import { useTasks } from "../../contexts/TasksContext";
import { useLists } from "../../contexts/ListsContext";
import { useDisplay } from "../../contexts/DisplayContext";
import AddTask from "./AddTask";
import TaskCard from "./TaskCard";

function TaskList({ header }) {
  const { isSelectedTask, openTask, closeTask } = useTasks();
  const { getListById } = useLists();
  const { activeView, isSearching, visibleTasks: tasks } = useDisplay();

  const remainingTasksCounter = useMemo(
    () => tasks.filter((task) => !task.checked).length,
    [tasks],
  );

  return (
    <section className="flex max-h-189.5 grow flex-col overflow-y-auto py-5">
      <header className="mb-5 flex w-full px-5">
        <h1 id="task-list-heading" className="ms-2.5 text-[2.5rem] font-bold">
          {header}
        </h1>

        {remainingTasksCounter > 0 && (
          <div className="ms-7.5 h-fit rounded-md border px-2.5 py-1 text-4xl">
            {remainingTasksCounter}
          </div>
        )}
      </header>

      <section aria-labelledby="task-list-heading">
        {!isSearching && (
          <AddTask
            key={`${activeView.type}-${activeView.id ?? ""}`}
            activeView={activeView}
          />
        )}

        <div className="mx-5 flex-1 overflow-y-auto">
          {tasks.length > 0 ? (
            <ul>
              {tasks.map((task) => (
                <li key={task._id}>
                  <TaskCard
                    task={task}
                    headingLevel={2}
                    onSelect={() => {
                      if (isSelectedTask(task._id)) {
                        closeTask();
                      } else {
                        openTask(task._id);
                      }
                    }}
                    // Tag condition in case a tag has same id as list
                    listDetails={
                      activeView.type !== "tag" &&
                      activeView.id !== task.listId &&
                      getListById(task.listId)
                    }
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="my-2.5 w-full text-center text-neutral-500">
              🎉 You're all caught up!
            </p>
          )}
        </div>
      </section>
    </section>
  );
}

export default TaskList;
