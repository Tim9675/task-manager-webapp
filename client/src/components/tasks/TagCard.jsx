function TagCard({ title, color }) {
  return (
    <div
      className="my-1 rounded px-4 py-1 text-sm shadow-xs shadow-[#aaaaaa] inset-shadow-[#aaaaaa]"
      style={{ backgroundColor: color }}
    >
      <span>{title}</span>
    </div>
  );
}

export default TagCard;
