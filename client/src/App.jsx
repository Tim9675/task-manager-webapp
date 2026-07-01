import { BrowserRouter, Routes, Route } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css";
import { Toaster } from "react-hot-toast";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { TasksProvider } from "./contexts/TasksContext";
import { ListsProvider } from "./contexts/ListsContext";
import { TagsProvider } from "./contexts/TagsContext";
import { NotesProvider } from "./contexts/NotesContext";
import { DisplayProvider } from "./contexts/DisplayContext";

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
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <TasksProvider>
                <ListsProvider>
                  <TagsProvider>
                    <NotesProvider>
                      <DisplayProvider>
                        <DashboardPage />
                      </DisplayProvider>
                    </NotesProvider>
                  </TagsProvider>
                </ListsProvider>
              </TasksProvider>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
