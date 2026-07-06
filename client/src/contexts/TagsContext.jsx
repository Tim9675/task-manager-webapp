import { createContext, useContext, useState, useEffect } from "react";

import { useTasks } from "./TasksContext";
import { getUserTags } from "../api/tagApi";
import { showApiError } from "./helpers/showApiResponse";
import useTagCrud from "./hooks/useTagCrud";
import useTagDerivedData from "./hooks/useTagDerivedData";

const TagsContext = createContext();

export function TagsProvider({ children }) {
  const [userTags, setUserTags] = useState([]);
  const { userTasks, removeTagFromTasks } = useTasks();
  const [isLoadingTags, setIsLoadingTags] = useState(true);

  useEffect(() => {
    async function fetchTags() {
      try {
        const tags = await getUserTags();
        setUserTags(tags);
      } catch (error) {
        showApiError(error, "Error when fetching tags");
      } finally {
        setIsLoadingTags(false);
      }
    }

    fetchTags();
  }, []);

  const availableTagColors = ["#d1eaed", "#ffdada", "#fdf2b3", "#ffd4a9"];

  const crud = useTagCrud({ userTags, setUserTags, removeTagFromTasks });

  const derived = useTagDerivedData({ userTags, userTasks });

  return (
    <TagsContext.Provider
      value={{
        userTags,
        availableTagColors,
        ...crud,
        ...derived,
        isLoadingTags,
      }}
    >
      {children}
    </TagsContext.Provider>
  );
}

export function useTags() {
  const context = useContext(TagsContext);

  if (!context) {
    throw new Error("useTags must be used within TagsProvider");
  }

  return context;
}
