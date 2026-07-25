import TasksProvider from "../contexts/TasksProvider";
import ListsProvider from "../contexts/ListsProvider";
import TagsProvider from "../contexts/TagsProvider";
import NotesProvider from "../contexts/NotesProvider";
import DisplayProvider from "../contexts/DisplayProvider";

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
