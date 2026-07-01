import { Loader } from "lucide-react";

function DashboardLoadingPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex h-25 flex-col items-center justify-evenly">
        <div className="motion-safe:animate-spin">
          <Loader size={30} color="black" />
        </div>
        <p className="text-2.75 text-black">Loading dashboard...</p>
      </div>
    </div>
  );
}

export default DashboardLoadingPage;
