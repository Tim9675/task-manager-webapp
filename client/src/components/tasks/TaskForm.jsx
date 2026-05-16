import ButtonBar from "./ButtonBar";
import SubtaskSection from "./SubtaskSection";
import TagSection from "./TagSection";

function TaskForm() {
  const userLists = [
    // REMINDER: Change to fetch getLists later
    {
      id: 0,
      name: "Personally long list for a very long person",
    },
    {
      id: 1,
      name: "Work",
    },
    {
      id: 2,
      name: "List 1",
    },
  ];
  return (
    <form className="flex w-full flex-col">
      {/* Title */}
      <input
        type="text"
        className="my-3 w-full rounded-md border border-[#ebebeb] px-2 md:h-10"
        placeholder="Title"
        required
      />
      {/* Description */}
      <textarea
        className="w-full resize-none rounded-md border border-[#ebebeb] p-2 md:h-29"
        placeholder="Description"
      />
      {/* List */}
      <div className="my-1 flex h-9 w-50 items-center justify-between">
        <label htmlFor="list" className="text-sm">
          List
        </label>
        <select
          id="list"
          name="list"
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
          {/* <Controller
            id="dueDate"
            control={control}
            name="dueDate"
            render={({ field: { onChange, onBlur, value } }) => (
              <DatePicker
                id="dueDate"
                aria-label="Select due date"
                onChange={onChange}
                onBlur={onBlur}
                selected={value || null}
                dateFormat={"dd-MM-yy"}
                className="md:h-7 md:w-25 rounded-md border border-[#ebebeb] "
              />
            )}
          /> */}
        </div>
      </div>
      {/* Tags */}
      <TagSection />
      {/* Subtasks */}
      <SubtaskSection />

      <ButtonBar />
    </form>
  );
}

export default TaskForm;
