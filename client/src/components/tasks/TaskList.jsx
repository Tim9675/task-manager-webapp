import { useState, useMemo, useRef } from "react";
import { Pen, Pencil, Trash2 } from "lucide-react";

import { useTasks } from "../../contexts/TasksContext";
import { useLists } from "../../contexts/ListsContext";
import { useTags } from "../../contexts/TagsContext";
import { useDisplay } from "../../contexts/DisplayContext";
import AddTask from "./AddTask";
import TaskCard from "./TaskCard";
import TaskListActions from "./TaskListActions";

const iconSize = 28;
const iconWidth = 2;

function TaskList() {
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const returnFocusRef = useRef(null);

  const { isSelectedTask, openTask, closeTask } = useTasks();
  const { getListById } = useLists();
  const { getTagById } = useTags();
  const { header, activeView, isSearching, visibleTasks: tasks } = useDisplay();

  const remainingTasksCounter = useMemo(
    () => tasks.filter((task) => !task.checked).length,
    [tasks],
  );

  const itemType = activeView.type;
  const item =
    itemType === "list"
      ? getListById(activeView.id)
      : getTagById(activeView.id);

  return (
    <>
      <section className="flex max-h-189.5 grow flex-col overflow-y-auto py-5">
        <header className="mb-5 flex w-full justify-between gap-5 px-5">
          <div className="flex">
            <h1
              id="task-list-heading"
              className="ms-2.5 text-[2.5rem] font-bold wrap-anywhere"
            >
              {header}
            </h1>

            {remainingTasksCounter > 0 && (
              <div className="ms-7.5 h-fit rounded-md border px-2.5 py-1 text-4xl">
                {remainingTasksCounter}
              </div>
            )}
          </div>
          <div
            className={`flex h-full items-center justify-center gap-2 ${itemType === "list" || itemType === "tag" ? "visible" : "hidden"}`}
          >
            <button
              type="button"
              onClick={(e) => {
                setIsEdit(true);
                returnFocusRef.current = e.target;
              }}
              className="flex size-12 cursor-pointer items-center justify-center rounded-md text-[#7c7c7c] hover:bg-neutral-200 hover:text-blue-600 focus:text-blue-600"
              aria-label={`Edit ${header}`}
            >
              <Pencil size={iconSize} strokeWidth={iconWidth} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                setIsDelete(true);
                returnFocusRef.current = e.target;
              }}
              className="flex size-12 cursor-pointer items-center justify-center rounded-md text-[#7c7c7c] hover:bg-neutral-200 hover:text-red-600 focus:text-red-600"
              aria-label={`Delete ${header}`}
            >
              <Trash2 size={iconSize} strokeWidth={iconWidth} />
            </button>
          </div>
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
      {(isEdit || isDelete) && (
        <TaskListActions
          isEdit={isEdit}
          isDelete={isDelete}
          type={itemType}
          item={item}
          onClose={isEdit ? () => setIsEdit(false) : () => setIsDelete(false)}
          taskCount={remainingTasksCounter}
          returnFocusRef={returnFocusRef}
        />
      )}
    </>
  );
}

export default TaskList;
