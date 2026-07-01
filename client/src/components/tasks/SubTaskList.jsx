import { useContext } from "react";

import TaskCard from "./TaskCard";
import AddTask from "./AddTask";
import { ListsContext } from "../../contexts/ListsContext";
import { useTasks } from "../../contexts/TasksContext";

function SubTaskList({ tasks, id, header }) {
  const { getListById } = useContext(ListsContext);
  const { openTask } = useTasks();

  return (
    <div className="flex h-full grow flex-col rounded-md border border-[#ebebeb] py-5">
      <header className="mb-2.5 flex w-full px-2.5">
        <h3 className="ms-2.5 text-[1.25rem] font-bold">{header}</h3>
      </header>
      <AddTask
        key={`upcoming-${header}`}
        activeView={{ type: "upcoming", id: id }}
      />
      <div className="mx-5 flex-1 overflow-y-auto">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onSelect={() => openTask(task._id)}
              listDetails={getListById(task.listId)}
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

export default SubTaskList;
