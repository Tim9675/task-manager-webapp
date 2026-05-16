import { X } from "lucide-react";
import TaskForm from "./TaskForm";

function TaskDetailsPanel({ selectedTask }) {
  return (
    <aside className="my-5 me-5 flex h-[calc(100vh-2.5rem)] w-100 flex-col rounded-2xl bg-neutral-100 px-5 py-5">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-neutral-900">Task:</h2>
        <button className="cursor-pointer">
          <X color="#7c7c7c" size={20} strokeWidth={4} />
        </button>
      </header>
      <TaskForm selectedTask={selectedTask} />
    </aside>
  );
}

export default TaskDetailsPanel;
