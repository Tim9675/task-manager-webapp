import Checkbox from "@mui/material/Checkbox";
import { Controller } from "react-hook-form";
import { Trash2 } from "lucide-react";

function SubtaskCard({ subtask, control, index, remove }) {
  const label = { slotProps: { input: { "aria-label": "Checkbox" } } };
  const sx = {
    color: "#dddddd",
    aspectRatio: 1 / 1,
    "&:hover": { background: "transparent" },
    "&.Mui-checked": {
      color: "#ffd43b",
    },
    "&.Mui-checked + div": {
      color: "#7c7c7c",
    },
    "&.Mui-checked + div .subtask-title": {
      textDecoration: "line-through",
    },
    "& .MuiSvgIcon-root": { fontSize: 18 },
  };
  return (
    <div className="border-[#ebebeb] transition-colors not-first:border-t hover:bg-[#fcfcfc] md:min-h-10">
      <div className="flex min-h-11 items-center">
        <Controller
          control={control}
          name={`subtasks.${index}.checked`}
          render={({ field }) => (
            <Checkbox
              {...label}
              checked={field.value}
              onChange={(e) => {
                field.onChange(e.target.checked);
              }}
              sx={sx}
            />
          )}
        />
        <Controller
          control={control}
          name={`subtasks.${index}.title`}
          render={({ field }) => (
            <input
              {...field}
              className="h-8 flex-1 bg-transparent text-sm outline-none focus:border-neutral-700"
            />
          )}
        />
        {/* Add delete functionality later */}
        <button
          type="button"
          className="flex size-10 cursor-pointer items-center justify-center"
          onClick={() => remove(index)}
        >
          <Trash2 color="#7c7c7c" size={18} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}

export default SubtaskCard;
