function TagCard({ tag }) {
  return (
    <div
      className="my-1 rounded px-4 py-1 text-sm shadow-xs shadow-[#aaaaaa] inset-shadow-[#aaaaaa]"
      style={{ backgroundColor: tag.color }}
    >
      <h3>{tag.title}</h3>
    </div>
  );
}

export default TagCard;
