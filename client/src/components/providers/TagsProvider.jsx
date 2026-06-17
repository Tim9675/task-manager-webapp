import { useContext, useState, useMemo, useCallback } from "react";

import { TagsContext } from "../../contexts/TagsContext";
import { mockTags } from "../../mock/tags";
import { TasksContext } from "../../contexts/TasksContext";

function TagsProvider({ children }) {
  const [userTags, setUserTags] = useState(mockTags);
  const { userTasks, removeTagFromTasks } = useContext(TasksContext);

  const userTagsMap = useMemo(
    () => Object.fromEntries(userTags.map((tag) => [tag.id, tag])),
    [userTags],
  );

  const availableTagColors = ["#d1eaed", "#ffdada", "#fdf2b3", "#ffd4a9"];

  // CRUD functions
  function createTag(title, color) {
    const normalizedTitle = title.trim().toLowerCase();
    const duplicate = userTags.some(
      (tag) => tag.title.trim().toLowerCase() === normalizedTitle,
    );
    if (!normalizedTitle) return { success: false, error: "empty" };
    if (duplicate) return { success: false, error: "duplicate" };
    const newTag = {
      id: crypto.randomUUID(),
      title: title,
      color: color,
    };
    setUserTags((prev) => [...prev, newTag]);
    return { success: true };
  }

  function updateTag(updatedTag) {
    const normalizedTitle = updatedTag.title.trim().toLowerCase();
    if (!normalizedTitle) return { success: false, error: "empty" };
    const duplicate = userTags.some(
      (tag) =>
        tag.id !== updatedTag.id &&
        tag.title.trim().toLowerCase() === normalizedTitle,
    );
    if (duplicate) return { success: false, error: "duplicate" };
    setUserTags((prev) =>
      prev.map((tag) => (tag.id === updatedTag.id ? updatedTag : tag)),
    );
    return { success: true };
  }

  function deleteTag(tagId) {
    setUserTags((prev) => prev.filter((tag) => tag.id !== tagId));
    removeTagFromTasks(tagId);
  }

  // Helper functions
  const getTasksByTag = useCallback(
    (tagId) => userTasks.filter((task) => task.tagIds.includes(tagId)),
    [userTasks],
  );

  function getTagTitle(id) {
    return userTagsMap[id]?.title;
  }

  return (
    <TagsContext.Provider
      value={{
        userTags,
        availableTagColors,
        createTag,
        updateTag,
        deleteTag,
        getTasksByTag,
        getTagTitle,
      }}
    >
      {children}
    </TagsContext.Provider>
  );
}

export default TagsProvider;
