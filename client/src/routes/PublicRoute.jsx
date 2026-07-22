import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import DashboardLoadingPage from "../pages/DashboardLoadingPage";

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <DashboardLoadingPage />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PublicRoute;
