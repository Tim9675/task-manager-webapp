import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import DashboardLoadingPage from "../pages/DashboardLoadingPage";

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  const token = localStorage.getItem("token");

  if (loading) {
    return token ? <DashboardLoadingPage /> : children;
  }

  if (user || token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PublicRoute;
