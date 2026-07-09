import { X } from "lucide-react";
import { useState } from "react";

import TaskForm from "./TaskForm";
import Modal from "../modals/Modal.jsx";
import { useTasks } from "../../contexts/TasksContext";
import { PANEL_ANIMATION_MS } from "../../helpers/styles.js";

function TaskDetailsPanel() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    selectedTask,
    onDeleteTask,
    isDeletingTask,
    isTaskDetailsOpen,
    closeTask,
  } = useTasks();

  return (
    <div
      className={`overflow-hidden transition-all ease-in-out ${isTaskDetailsOpen ? "w-105" : "w-0"}`}
      style={{ transitionDuration: `${PANEL_ANIMATION_MS}ms` }}
    >
      <aside
        className={`my-5 me-5 flex h-[calc(100vh-2.5rem)] w-100 flex-col rounded-2xl bg-neutral-100 px-5 py-5 transition-all ease-in-out ${!isTaskDetailsOpen && " translate-x-[110%]"}`}
        style={{ transitionDuration: `${PANEL_ANIMATION_MS}ms` }}
      >
        <header className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900">Task:</h2>
          <button onClick={closeTask} className="cursor-pointer">
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

        <Modal
          isOpen={isDeleteModalOpen}
          header="Warning!"
          onAction={async () => {
            closeTask();
            if (selectedTask) await onDeleteTask(selectedTask._id);
            setIsDeleteModalOpen(false);
          }}
          onClose={() => setIsDeleteModalOpen(false)}
          isLoading={isDeletingTask}
          action={isDeletingTask ? "Deleting..." : "Delete"}
        >
          <p className="my-5 text-center">Delete this task?</p>
        </Modal>
      </aside>
    </div>
  );
}

export default TaskDetailsPanel;
