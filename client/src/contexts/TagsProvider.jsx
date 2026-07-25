import { useState, useEffect } from "react";

import { useTasks } from "./useTasks";
import { getUserTags } from "../api/tagApi";
import { showApiError } from "./helpers/showApiResponse";
import useTagCrud from "./hooks/useTagCrud";
import useTagDerivedData from "./hooks/useTagDerivedData";
import TagsContext from "./TagsContext";

function TagsProvider({ children }) {
  const [userTags, setUserTags] = useState([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const { userTasks, removeTagFromTasks } = useTasks();

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

  const availableTagColors = [
    { value: "#d1eaed", label: "Powder blue" },
    { value: "#ffdada", label: "Blush pink" },
    { value: "#fdf2b3", label: "Vanilla" },
    { value: "#ffd4a9", label: "Peach" },
  ];

  const crud = useTagCrud({ userTags, setUserTags, removeTagFromTasks });

  const derived = useTagDerivedData({ userTags, userTasks });

  return (
    <TagsContext.Provider
      value={{
        userTags,
        isLoadingTags,
        availableTagColors,
        ...crud,
        ...derived,
      }}
    >
      {children}
    </TagsContext.Provider>
  );
}

export default TagsProvider;
