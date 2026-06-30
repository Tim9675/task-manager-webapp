import { BrowserRouter, Routes, Route } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css";
import { Toaster } from "react-hot-toast";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import TasksProvider from "./components/providers/TasksProvider";
import ListsProvider from "./components/providers/ListsProvider";
import TagsProvider from "./components/providers/TagsProvider";
import NotesProvider from "./components/providers/NotesProvider";
import DisplayProvider from "./components/providers/DisplayProvider";

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
