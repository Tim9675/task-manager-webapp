import { useMemo } from "react";

import { useDisplay } from "../../contexts/DisplayContext";
import { getTaskDateBuckets } from "../../utils/date";
import SubTaskList from "./SubTaskList";

function Upcoming() {
  const { visibleTasks: tasks } = useDisplay();

  let remainingTasksCounter = 0;
  for (let task of tasks) {
    if (!task.checked) remainingTasksCounter++;
  }

  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const { today, tomorrow, thisWeek } = getTaskDateBuckets(zone);

  const grouped = useMemo(() => {
    const temp = {
      today: [],
      tomorrow: [],
      thisWeek: [],
    };
    for (const task of tasks) {
      if (!task.dueDate) continue;

      const due = new Date(task.dueDate);
      if (due >= today.start && due < today.end) {
        temp.today.push(task);
      } else if (due >= tomorrow.start && due < tomorrow.end) {
        temp.tomorrow.push(task);
      } else if (due >= thisWeek.start && due < thisWeek.end) {
        temp.thisWeek.push(task);
      }
    }
    return temp;
  }, [tasks]);

  return (
    <div className="flex h-full grow flex-col py-5">
      <header className="mb-5 flex w-full px-5">
        <h1
          id="upcoming-list-heading"
          className="ms-2.5 text-[2.5rem] font-bold"
        >
          Upcoming
        </h1>

        {remainingTasksCounter > 0 && (
          <div className="ms-7.5 h-fit rounded-md border px-2.5 py-1 text-4xl">
            {remainingTasksCounter}
          </div>
        )}
      </header>

      <section
        className="flex flex-col gap-5 px-5"
        aria-labelledby="upcoming-list-heading"
      >
        <SubTaskList tasks={grouped.today} id={"today"} header={"Today"} />

        <div className="flex flex-col gap-5 md:flex-row">
          <SubTaskList
            tasks={grouped.tomorrow}
            id={"tomorrow"}
            header={"Tomorrow"}
          />
          <SubTaskList
            tasks={grouped.thisWeek}
            id={"thisWeek"}
            header={"This Week"}
          />
        </div>
      </section>
    </div>
  );
}

export default Upcoming;
