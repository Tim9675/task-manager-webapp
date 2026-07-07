import { BrowserRouter, Routes, Route } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css";
import { Toaster } from "react-hot-toast";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PublicRoute from "./routes/PublicRoute";
import AppProviders from "./providers/AppProviders";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
        }}
      />
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppProviders>
                <DashboardPage />
              </AppProviders>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
