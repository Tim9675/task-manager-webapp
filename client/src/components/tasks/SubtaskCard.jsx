import Checkbox from "@mui/material/Checkbox";
import { Controller } from "react-hook-form";

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
              className="flex-1 bg-transparent text-sm outline-none"
            />
          )}
        />
        {/* Add delete functionality later */}
      </div>
    </div>
  );
}

export default SubtaskCard;
