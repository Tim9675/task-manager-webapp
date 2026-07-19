import Skeleton from "react-loading-skeleton";

import { useDisplay } from "../../contexts/DisplayContext";

function TaskListSkeleton() {
  const { header } = useDisplay();

  return (
    <div className="flex h-full grow flex-col py-5">
      <header className="mb-5 flex w-full px-5">
        <h1 id="task-list-heading" className="ms-2.5 text-[2.5rem] font-bold">
          {header}
        </h1>
        <Skeleton height={48} width={41} borderRadius={6} className="ms-7.5" />
      </header>

      <section aria-labelledby="task-list-heading" aria-busy="true">
        <Skeleton height={52} width={"96%"} className="mx-5" />

        <div className="mx-5 flex-1 overflow-y-auto">
          <div className="border-b border-[#ebebeb] py-3">
            <Skeleton height={20} width="70%" />
            <Skeleton height={14} width="40%" className="mt-2" />
          </div>
          <div className="border-b border-[#ebebeb] py-3">
            <Skeleton height={20} width="70%" />
            <Skeleton height={14} width="40%" className="mt-2" />
          </div>
          <div className="border-b border-[#ebebeb] py-3">
            <Skeleton height={20} width="70%" />
            <Skeleton height={14} width="40%" className="mt-2" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default TaskListSkeleton;
