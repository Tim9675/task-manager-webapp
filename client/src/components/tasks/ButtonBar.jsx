import { useContext } from "react";

import { TasksContext } from "../../contexts/TasksContext";

function ButtonBar({ onOpen }) {
  const { isUpdatingTask } = useContext(TasksContext);

  return (
    <div className="mt-2 flex w-full items-center justify-between gap-5 md:h-10">
      <button
        type="button"
        onClick={onOpen}
        disabled={isUpdatingTask}
        className="h-10 flex-1 cursor-pointer rounded-md border border-[#dddddd] bg-[#f5f5f5] hover:brightness-95 disabled:cursor-not-allowed disabled:hover:brightness-100"
      >
        Delete Task
      </button>
      <button
        type="submit"
        disabled={isUpdatingTask}
        className="h-10 flex-1 cursor-pointer rounded-md bg-[#ffd43b] hover:brightness-95 disabled:cursor-not-allowed disabled:bg-[#bbbbbb] disabled:hover:brightness-100"
      >
        Save changes
      </button>
    </div>
  );
}

export default ButtonBar;
