import { useFieldArray } from "react-hook-form";

import AddSubtask from "./AddSubtask";
import SubtaskCard from "./SubtaskCard";

function SubtaskSection({ setValue, control }) {
  const {
    fields: subtaskFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "subtasks",
  });

  const isEmpty = subtaskFields.length === 0;

  function handleAddSubtask(title) {
    if (!title.trim()) return;

    append({
      title,
      checked: false,
    });
  }

  return (
    <fieldset className="my-2 flex w-full flex-col">
      <legend className="text-xl font-bold text-neutral-900">Subtasks:</legend>
      <AddSubtask onAdd={handleAddSubtask} />
      <ul className="h-50 overflow-y-auto rounded-md border border-[#ebebeb]">
        {isEmpty ? (
          <li className="p-3 text-center text-sm text-neutral-500">
            No subtasks yet.
          </li>
        ) : (
          subtaskFields.map((field, index) => (
            <li key={field.id}>
              <SubtaskCard
                setValue={setValue}
                control={control}
                index={index}
                remove={remove}
              />
            </li>
          ))
        )}
      </ul>
    </fieldset>
  );
}

export default SubtaskSection;
