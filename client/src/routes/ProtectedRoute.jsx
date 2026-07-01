import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import DashboardLoadingPage from "../pages/DashboardLoadingPage";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <DashboardLoadingPage />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default ProtectedRoute;
