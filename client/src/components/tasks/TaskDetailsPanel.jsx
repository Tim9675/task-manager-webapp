import { X } from "lucide-react";
import { useContext, useState } from "react";

import TaskForm from "./TaskForm";
import DeleteTaskModal from "./DeleteTaskModal";
import { TasksContext } from "../../contexts/TasksContext";

function TaskDetailsPanel({ onClose }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { selectedTask, onDeleteTask } = useContext(TasksContext);

  return (
    <aside className="my-5 me-5 flex h-[calc(100vh-2.5rem)] w-100 flex-col rounded-2xl bg-neutral-100 px-5 py-5">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-neutral-900">Task:</h2>
        <button onClick={onClose} className="cursor-pointer">
          <X color="#7c7c7c" size={20} strokeWidth={4} />
        </button>
      </header>
      {selectedTask ? (
        <TaskForm
          selectedTask={selectedTask}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
        />
      ) : (
        <div className="flex flex-1 items-center justify-center text-sm text-neutral-500">
          Select a task to view details.
        </div>
      )}

      {isDeleteModalOpen && (
        <DeleteTaskModal
          onDelete={() => {
            if (selectedTask) onDeleteTask(selectedTask._id);
            onClose();
          }}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
    </aside>
  );
}

export default TaskDetailsPanel;
