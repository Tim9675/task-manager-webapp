import { useLists } from "../../contexts/ListsContext";
import { useTasks } from "../../contexts/TasksContext";
import AddTask from "./AddTask";
import TaskCard from "./TaskCard";

function SubTaskList({ tasks, id, header }) {
  const { getListById } = useLists();
  const { isSelectedTask, openTask, closeTask } = useTasks();

  return (
    <article className="flex h-61.25 grow flex-col rounded-md border border-[#ebebeb] py-5 md:h-80">
      <header className="mb-2.5 flex w-full px-2.5">
        <h2 className="ms-2.5 text-[1.25rem] font-bold">{header}</h2>
      </header>

      <AddTask
        key={`upcoming-${header}`}
        activeView={{ type: "upcoming", id: id }}
      />
      <div className="mx-5 flex-1 overflow-y-auto">
        {tasks.length > 0 ? (
          <ul>
            {tasks.map((task) => (
              <li key={task._id}>
                <TaskCard
                  task={task}
                  headingLevel={3}
                  onSelect={() => {
                    if (isSelectedTask(task._id)) {
                      closeTask();
                    } else {
                      openTask(task._id);
                    }
                  }}
                  listDetails={getListById(task.listId)}
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
    </article>
  );
}

export default SubTaskList;
