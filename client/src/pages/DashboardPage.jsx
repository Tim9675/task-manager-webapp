import TaskList from "../components/tasks/TaskList";
import DashboardLayout from "../layouts/DashboardLayout";

function DashboardPage() {
  return (
    <DashboardLayout>
      <TaskList />
    </DashboardLayout>
  );
}

export default DashboardPage;
