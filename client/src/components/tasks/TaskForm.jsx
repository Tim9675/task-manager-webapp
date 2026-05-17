import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import ButtonBar from "./ButtonBar";
import SubtaskSection from "./SubtaskSection";
import TagSection from "./TagSection";

function TaskForm({ selectedTask, updateTask }) {
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

  const userLists = [
    // REMINDER: Change to fetch using getListById later
    {
      id: 0,
      name: "Personal",
      color: "#ff6b6b",
    },
    {
      id: 1,
      name: "Work",
      color: "#66d9e8",
    },
    {
      id: 2,
      name: "List 1",
      color: "#ffd43b",
    },
  ];

  const availableTags = [
    { id: 0, title: "Tag 1", color: "#d1eaed" },
    { id: 1, title: "Tag 2", color: "#ffdada" },
  ];

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
    updateTask({
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
            setValueAs: (value) => (value === "" ? null : Number(value)),
          })}
          id="list"
          className="h-7 w-25 rounded-md border border-[#ebebeb] px-2 text-sm"
        >
          <option value="">--unlisted--</option>
          {userLists.map((list) => (
            <option key={list.id} value={list.id}>
              {list.name}
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
      <TagSection
        availableTags={availableTags}
        watch={watch}
        setValue={setValue}
      />
      {/* Subtasks */}
      <SubtaskSection control={control} watch={watch} setValue={setValue} />

      <ButtonBar />
    </form>
  );
}

export default TaskForm;
