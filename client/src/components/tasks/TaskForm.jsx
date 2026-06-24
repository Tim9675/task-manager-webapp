import { useContext, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import ButtonBar from "./ButtonBar";
import SubtaskSection from "./SubtaskSection";
import TagSection from "./TagSection";
import { ListsContext } from "../../contexts/ListsContext";
import { TagsContext } from "../../contexts/TagsContext";
import { TasksContext } from "../../contexts/TasksContext";

function TaskForm({ selectedTask, setIsDeleteModalOpen }) {
  const { register, control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      title: "",
      description: "",
      listId: null,
      dueDate: null,
      tagIds: [],
      subtasks: [],
    },
  });

  const { onUpdateTask } = useContext(TasksContext);
  const { userLists } = useContext(ListsContext);
  const { userTags } = useContext(TagsContext);

  useEffect(() => {
    if (!selectedTask) return;

    reset({
      title: selectedTask.title || "",
      description: selectedTask.description || "",
      listId: selectedTask.listId || null,
      dueDate: selectedTask.dueDate || null,
      tagIds: selectedTask.tagIds || [],
      subtasks: selectedTask.subtasks || [],
    });
  }, [selectedTask, reset]);

  function onSubmit(data) {
    onUpdateTask({
      ...selectedTask,
      ...data,
    });
  }

  return (
    <form
      className="flex w-full flex-col"
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.target.tagName !== "TEXTAREA")
          e.preventDefault();
      }}
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Title */}
      <input
        {...register("title", { required: true })}
        type="text"
        className="my-3 w-full rounded-md border border-[#ebebeb] px-2 md:h-10"
        placeholder="Title"
      />
      {/* Description */}
      <textarea
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
                onChange={(date) => {
                  if (!date) {
                    field.onChange(null);
                    return;
                  }

                  const normalizedDate = new Date(date);

                  normalizedDate.setHours(23, 59, 59, 999);

                  field.onChange(normalizedDate);
                }}
                className="h-full w-full rounded-md px-2 outline-none"
              />
            )}
          />
        </div>
      </div>
      {/* Tags */}
      <TagSection availableTags={userTags} watch={watch} setValue={setValue} />
      {/* Subtasks */}
      <SubtaskSection control={control} watch={watch} setValue={setValue} />

      <ButtonBar onOpen={() => setIsDeleteModalOpen(true)} />
    </form>
  );
}

export default TaskForm;
