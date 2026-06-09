import { BrowserRouter, Routes, Route } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import TasksProvider from "./components/providers/TasksProvider";
import ListsProvider from "./components/providers/ListsProvider";
import TagsProvider from "./components/providers/TagsProvider";
import NotesProvider from "./components/providers/NotesProvider";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <TasksProvider>
                <ListsProvider>
                  <TagsProvider>
                    <NotesProvider>
                      <DashboardPage />
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
