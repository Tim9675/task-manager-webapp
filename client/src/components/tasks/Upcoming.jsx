import SubTaskList from "./SubTaskList";
import { getTaskDateBuckets } from "../../utils/date";
import { useMemo } from "react";

function Upcoming({ tasks }) {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { today, tomorrow, thisWeek } = getTaskDateBuckets(zone);

  const grouped = useMemo(() => {
    const temp = {
      today: [],
      tomorrow: [],
      thisWeek: [],
    };
    for (const task of tasks) {
      // REMINDER: Possible type mismatch when backend is connected [String from backend, compared to Date in frontend]
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
    <div className="flex h-full grow flex-col gap-5">
      <div className="max-h-81 w-full grow px-5">
        <SubTaskList tasks={grouped.today} id={"today"} header={"Today"} />
      </div>
      <div className="flex max-h-79 w-full grow gap-5 px-5">
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
    </div>
  );
}

export default Upcoming;
