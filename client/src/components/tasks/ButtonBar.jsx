function ButtonBar() {
  return (
    <div className="mt-4 flex w-full items-center justify-between gap-5 md:h-10">
      <button
        type="button"
        className="h-10 flex-1 cursor-pointer rounded-md border border-[#dddddd] bg-[#f5f5f5] hover:brightness-95"
      >
        Delete Task
      </button>
      <button className="h-10 flex-1 cursor-pointer rounded-md bg-[#ffd43b] hover:brightness-95">
        Save changes
      </button>
    </div>
  );
}

export default ButtonBar;
