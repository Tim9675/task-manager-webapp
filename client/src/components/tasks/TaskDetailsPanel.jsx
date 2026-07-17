import { useState, useRef } from "react";
import { X } from "lucide-react";

import { useTasks } from "../../contexts/TasksContext";
import { PANEL_ANIMATION_MS } from "../../helpers/styles.js";
import TaskForm from "./TaskForm";
import Modal from "../modals/Modal.jsx";

function TaskDetailsPanel() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const returnFocusRef = useRef(null);

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
          <button
            type="button"
            onClick={closeTask}
            className="cursor-pointer"
            aria-label="Close task details panel"
          >
            <X color="#7c7c7c" size={20} strokeWidth={4} />
          </button>
        </header>

        {selectedTask ? (
          <TaskForm
            selectedTask={selectedTask}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
            returnFocusRef={returnFocusRef}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-neutral-600">
            Select a task to view details.
          </div>
        )}

        {isDeleteModalOpen && (
          <Modal
            header="Warning!"
            onAction={async () => {
              closeTask();
              if (selectedTask) await onDeleteTask(selectedTask._id);
              setIsDeleteModalOpen(false);
            }}
            onClose={() => setIsDeleteModalOpen(false)}
            isLoading={isDeletingTask}
            action={isDeletingTask ? "Deleting..." : "Delete"}
            descriptionId="delete-task-description"
            returnFocusRef={returnFocusRef}
          >
            <p
              role="alert"
              id="delete-task-description"
              className="my-5 text-center"
            >
              Delete this task?
            </p>
          </Modal>
        )}
      </aside>
    </div>
  );
}

export default TaskDetailsPanel;
