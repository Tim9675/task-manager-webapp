import { useState, useRef, useEffect } from "react";
import { useWatch, Controller } from "react-hook-form";
import { Save, Pencil, Trash2 } from "lucide-react";
import Checkbox from "@mui/material/Checkbox";

import { showWarning } from "../../contexts/helpers/showApiResponse";

const checkboxSx = {
  color: "#dddddd",
  aspectRatio: 1 / 1,
  "&.Mui-checked": {
    color: "#ffd43b",
  },
};

const iconSize = 18;
const iconWidth = 2;

function SubtaskCard({ setValue, control, index, remove }) {
  const [isEdit, setIsEdit] = useState(false);

  const inputRef = useRef(null);
  const originalTitle = useRef("");

  useEffect(() => {
    if (isEdit) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEdit]);

  const subtaskTitle = useWatch({ control, name: `subtasks.${index}.title` });
  const isChecked = useWatch({ control, name: `subtasks.${index}.checked` });
  const inputId = `subtask-title-${index}`;

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      setValue(`subtasks.${index}.title`, originalTitle.current);
      setIsEdit(false);
    }
    if (e.key === "Enter") {
      e.preventDefault();
      setIsEdit(false);
    }
  }

  function beginEditing() {
    originalTitle.current = subtaskTitle;
    setIsEdit(true);
  }

  function handleSave() {
    if (!subtaskTitle.trim()) {
      showWarning("Subtask title is required");
      return;
    }

    setValue(`subtasks.${index}.title`, subtaskTitle.trim(), {
      shouldDirty: true,
    });

    setIsEdit(false);
  }

  return (
    <div className="flex w-full items-center justify-between gap-2 border-[#ebebeb] transition-colors not-first:border-t hover:bg-[#fcfcfc] md:min-h-10">
      <div className="flex min-h-11 flex-1 items-center px-2.5">
        {isEdit ? (
          <Controller
            control={control}
            name={`subtasks.${index}.title`}
            disabled={isChecked}
            render={({ field }) => {
              return (
                <>
                  <label htmlFor={inputId} className="sr-only">
                    Subtask title
                  </label>
                  <input
                    id={inputId}
                    {...field}
                    ref={inputRef}
                    required
                    maxLength={100}
                    onKeyDown={(e) => handleKeyDown(e)}
                    className={`h-8 flex-1 rounded-md border border-[#ebebeb] bg-transparent px-1 text-sm focus:border-neutral-700`}
                    aria-required
                  />
                </>
              );
            }}
          />
        ) : (
          <>
            <Controller
              control={control}
              name={`subtasks.${index}.checked`}
              render={({ field }) => (
                <Checkbox
                  slotProps={{
                    input: {
                      "aria-label": `Toggle ${subtaskTitle} completion`,
                    },
                  }}
                  checked={field.value}
                  onChange={(_, checked) => {
                    field.onChange(checked);
                    setIsEdit(false);
                  }}
                  sx={checkboxSx}
                />
              )}
            />
            <span
              className={`line-clamp-6 text-sm wrap-anywhere ${isChecked && "text-neutral-500 line-through"}`}
            >
              {subtaskTitle}
            </span>
          </>
        )}
      </div>

      {isEdit ? (
        <button
          type="button"
          onClick={handleSave}
          className="me-1 flex size-8 cursor-pointer items-center justify-center rounded-md bg-green-400 text-[#7c7c7c] hover:brightness-95 focus:brightness-95"
          aria-label="Save subtask title edit"
        >
          <Save size={iconSize} strokeWidth={iconWidth} />
        </button>
      ) : (
        <div className="flex items-center justify-between">
          {!isChecked && (
            <button
              type="button"
              onClick={beginEditing}
              className="flex size-10 cursor-pointer items-center justify-center text-[#7c7c7c] hover:text-blue-600 focus:text-blue-600"
              aria-label={`Edit ${subtaskTitle}`}
            >
              <Pencil size={iconSize} strokeWidth={iconWidth} />
            </button>
          )}

          <button
            type="button"
            onClick={() => remove(index)}
            className="flex size-10 cursor-pointer items-center justify-center text-[#7c7c7c] hover:text-red-600 focus:text-red-600"
            aria-label={`Delete ${subtaskTitle} subtask`}
          >
            <Trash2 size={iconSize} strokeWidth={iconWidth} />
          </button>
        </div>
      )}
    </div>
  );
}

export default SubtaskCard;
