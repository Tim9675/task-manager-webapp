import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useTasks } from "../../contexts/TasksContext";
import { useLists } from "../../contexts/ListsContext";
import TagSection from "./TagSection";
import SubtaskSection from "./SubtaskSection";
import ButtonBar from "./ButtonBar";
import DeleteItemModal from "../modals/DeleteItemModal";

function TaskForm({ selectedTask }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const returnFocusRef = useRef(null);

  const {
    register,
    formState: { dirtyFields },
    watch,
    handleSubmit,
    reset,
    setValue,
    control,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      listId: null,
      dueDate: null,
      tagIds: [],
      subtasks: [],
    },
  });

  const { onUpdateTask, onDeleteTask, isDeletingTask, closeTask } = useTasks();
  const { userLists } = useLists();

  useEffect(() => {
    if (!selectedTask) return;

    // Register virtual field managed through TagSection.
    register("tagIds");

    reset({
      title: selectedTask.title || "",
      description: selectedTask.description || "",
      listId: selectedTask.listId || null,
      dueDate: normalizeDate(selectedTask.dueDate),
      tagIds: selectedTask.tagIds || [],
      subtasks: selectedTask.subtasks || [],
    });
  }, [selectedTask, reset, register]);

  function normalizeDate(date) {
    if (!date) return null;

    const normalizedDate = new Date(date);
    normalizedDate.setHours(23, 59, 59, 999);
    return normalizedDate;
  }

  function handleSubmitForm(data) {
    const changedValues = {};

    for (const key of Object.keys(dirtyFields)) {
      changedValues[key] = data[key];
    }

    onUpdateTask(selectedTask._id, changedValues);
  }

  return (
    <>
      <form
        className="flex w-full flex-col"
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.target.tagName !== "TEXTAREA")
            e.preventDefault();
        }}
        onSubmit={handleSubmit(handleSubmitForm)}
      >
        {/* Title */}
        <label htmlFor="task-title" className="sr-only">
          Task title
        </label>
        <input
          id="task-title"
          {...register("title", { required: true })}
          type="text"
          className="my-3 w-full rounded-md border border-[#ebebeb] px-2 md:h-10"
          placeholder="Title"
        />
        {/* Description */}
        <label htmlFor="task-description" className="sr-only">
          Task description
        </label>
        <textarea
          id="task-description"
          {...register("description")}
          className="w-full resize-none rounded-md border border-[#ebebeb] p-2 md:h-29"
          placeholder="Description"
        />
        {/* List */}
        <div className="my-1 flex h-9 w-50 items-center justify-between">
          <label htmlFor="list" className="text-sm">
            List
          </label>
          <select
            {...register("listId", {
              setValueAs: (value) => (value === "" ? null : value),
            })}
            id="list"
            className="h-7 w-25 rounded-md border border-[#ebebeb] px-2 text-sm"
          >
            <option value="">--unlisted--</option>
            {userLists.map((list) => (
              <option key={list._id} value={list._id}>
                {list.title}
              </option>
            ))}
          </select>
        </div>
        {/* Due Date */}
        <div className="my-1 flex h-9 w-49 items-center justify-between">
          <label htmlFor="dueDate" className="text-sm">
            Due Date
          </label>
          <div className="h-7 w-24 rounded-md border border-[#ebebeb] text-sm">
            <Controller
              control={control}
              name="dueDate"
              render={({ field }) => (
                <DatePicker
                  id="dueDate"
                  selected={field.value}
                  onChange={(date) => field.onChange(normalizeDate(date))}
                  className="h-full w-full rounded-md px-2 outline-none"
                />
              )}
            />
          </div>
        </div>
        {/* Tags */}
        <TagSection
          watch={watch}
          setValue={setValue}
          returnFocusRef={returnFocusRef}
        />
        {/* Subtasks */}
        <SubtaskSection setValue={setValue} control={control} />

        <ButtonBar
          onOpen={() => {
            setIsDeleteModalOpen(true);
            returnFocusRef.current = document.activeElement;
          }}
        />
      </form>

      {isDeleteModalOpen && (
        <DeleteItemModal
          itemType="task"
          title={selectedTask.title}
          onDelete={async () => {
            closeTask();
            if (selectedTask) await onDeleteTask(selectedTask._id);
            setIsDeleteModalOpen(false);
          }}
          isDeleting={isDeletingTask}
          onClose={() => setIsDeleteModalOpen(false)}
          descriptionId="delete-task-description"
          returnFocusRef={returnFocusRef}
        />
      )}
    </>
  );
}

export default TaskForm;
