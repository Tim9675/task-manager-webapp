import Checkbox from "@mui/material/Checkbox";

function SubtaskCard({ subtask }) {
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
        <Checkbox
          {...label}
          checked={subtask.checked}
          onChange={() => {}}
          sx={sx}
        />
        <p className="subtask-title line-clamp-1 text-sm text-neutral-800">
          {subtask.title}
        </p>
      </div>
    </div>
  );
}

export default SubtaskCard;
