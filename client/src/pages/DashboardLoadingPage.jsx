import { Loader } from "lucide-react";

function DashboardLoadingPage() {
  return (
    <main
      className="flex h-screen w-screen flex-col items-center justify-center text-black"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="motion-safe:animate-spin" aria-hidden="true">
        <Loader size={30} />
      </div>
      <p role="status" className="text-2.75 mt-2.5">
        Loading dashboard...
      </p>
    </main>
  );
}

export default DashboardLoadingPage;
