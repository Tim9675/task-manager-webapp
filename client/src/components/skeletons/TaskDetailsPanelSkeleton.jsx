import { X } from "lucide-react";
import Skeleton from "react-loading-skeleton";

function TaskDetailsPanelSkeleton({ onClose }) {
  return (
    <aside className="my-5 me-5 flex h-[calc(100vh-2.5rem)] w-100 flex-col rounded-2xl bg-neutral-100 px-5 py-5">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-neutral-900">Task:</h2>
        <button onClick={onClose} className="cursor-pointer">
          <X color="#7c7c7c" size={20} strokeWidth={4} />
        </button>
      </header>
      <Skeleton className="my-3" width={"100%"} height={40} />
      <Skeleton className="my-3" width={"100%"} height={116} />
      <Skeleton className="my-1" width={"100%"} height={36} />
      <Skeleton className="my-1" width={"100%"} height={36} />
      <Skeleton className="my-2" width={"100%"} height={80} />
      <Skeleton className="my-2" width={"100%"} height={223} />
      <Skeleton className="mt-2" width={"100%"} height={40} />
    </aside>
  );
}

export default TaskDetailsPanelSkeleton;
