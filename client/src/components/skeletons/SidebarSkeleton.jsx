import { Menu } from "lucide-react";
import Skeleton from "react-loading-skeleton";

function SidebarSkeleton() {
  return (
    <aside className="my-5 ms-5 flex h-[calc(100vh-2.5rem)] w-72 flex-col rounded-2xl bg-neutral-100 px-4 py-5">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-neutral-900">Menu</h2>

        <button className="cursor-pointer">
          <Menu color="#7c7c7c" size={21} strokeWidth={3} />
        </button>
      </header>

      <Skeleton className="mt-3 mb-6" width={"100%"} height={36} />

      <Skeleton className="mb-5" width={"100%"} height={165} />
      <Skeleton className="mb-5" width={"100%"} height={175} />
      <Skeleton className="mb-4" width={"100%"} height={120} />

      <Skeleton width={"100%"} height={72} />
    </aside>
  );
}

export default SidebarSkeleton;
