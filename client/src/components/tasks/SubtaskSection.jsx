import { useFieldArray } from "react-hook-form";

import AddSubtask from "./AddSubtask";
import SubtaskCard from "./SubtaskCard";

function SubtaskSection({ control, watch, setValue }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtasks",
  });

  return (
    <div className="my-2 flex w-full flex-col">
      <h2 className="text-xl font-bold text-neutral-900">Subtasks:</h2>
      <AddSubtask append={append} />
      <div className="h-50 overflow-y-auto rounded-md border border-[#ebebeb]">
        {fields.map((field, index) => (
          <SubtaskCard
            key={field.id}
            subtask={field}
            control={control}
            index={index}
            remove={remove}
          />
        ))}
      </div>
    </div>
  );
}

export default SubtaskSection;
