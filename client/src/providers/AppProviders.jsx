import { TasksProvider } from "../contexts/TasksContext";
import { ListsProvider } from "../contexts/ListsContext";
import { TagsProvider } from "../contexts/TagsContext";
import { NotesProvider } from "../contexts/NotesContext";
import { DisplayProvider } from "../contexts/DisplayContext";

function AppProviders({ children }) {
  return (
    <TasksProvider>
      <ListsProvider>
        <TagsProvider>
          <NotesProvider>
            <DisplayProvider>{children}</DisplayProvider>
          </NotesProvider>
        </TagsProvider>
      </ListsProvider>
    </TasksProvider>
  );
}

export default AppProviders;
