import { useContext, useState, useMemo, useCallback, useEffect } from "react";

import { TagsContext } from "../../contexts/TagsContext";
import { TasksContext } from "../../contexts/TasksContext";
import { getUserTags, createTag, updateTag, deleteTag } from "../../api/tagApi";

function TagsProvider({ children }) {
  const [userTags, setUserTags] = useState([]);
  const { userTasks, removeTagFromTasks } = useContext(TasksContext);
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [isUpdatingTag, setIsUpdatingTag] = useState(false);

  useEffect(() => {
    async function fetchTags() {
      try {
        const tags = await getUserTags();
        console.log(tags);
        setUserTags(tags);
      } catch (error) {
        console.log("Error fetching tags:");
        console.log(error);
      } finally {
        setIsLoadingTags(false);
      }
    }

    fetchTags();
  }, []);

  const userTagsMap = useMemo(
    () => Object.fromEntries(userTags.map((tag) => [tag._id, tag])),
    [userTags],
  );

  const availableTagColors = ["#d1eaed", "#ffdada", "#fdf2b3", "#ffd4a9"];

  // CRUD functions
  async function onCreateTag(title, color) {
    const normalizedTitle = title.trim().toLowerCase();
    const duplicate = userTags.some(
      (tag) => tag.title.trim().toLowerCase() === normalizedTitle,
    );
    if (duplicate) return { success: false, error: "duplicate" };

    try {
      setIsCreatingTag(true);
      const res = await createTag(title, color);
      console.log(res);
      setUserTags((prev) => [...prev, res]);
      return { success: true };
    } catch (error) {
      console.log("Error in onCreateTag");
      console.log(error);
      return { success: false, error: "Server error in onCreateTag" };
    } finally {
      setIsCreatingTag(false);
    }
  }

  async function onUpdateTag(updatedTag) {
    const normalizedTitle = updatedTag.title.trim().toLowerCase();
    const duplicate = userTags.some(
      (tag) =>
        tag._id !== updatedTag._id &&
        tag.title.trim().toLowerCase() === normalizedTitle,
    );
    if (duplicate) return { success: false, error: "duplicate" };

    try {
      setIsUpdatingTag(true);
      const res = await updateTag(updatedTag);
      console.log(res);
      setUserTags((prev) =>
        prev.map((tag) => (tag._id === res._id ? res : tag)),
      );
      return { success: true };
    } catch (error) {
      console.log("Error in onUpdateTag");
      console.log(error);
      return { success: false, error: "Server error in onUpdateTag" };
    } finally {
      setIsUpdatingTag(false);
    }
  }

  async function onDeleteTag(tagId) {
    try {
      await deleteTag(tagId);
      setUserTags((prev) => prev.filter((tag) => tag._id !== tagId));
      removeTagFromTasks(tagId);
    } catch (error) {
      console.log("Error in onDeleteTag");
      console.log(error);
    }
  }

  // Helper functions
  const getCachedTasksByTag = useCallback(
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
        onCreateTag,
        onUpdateTag,
        onDeleteTag,
        getCachedTasksByTag,
        getTagTitle,
        isLoadingTags,
        isCreatingTag,
        isUpdatingTag,
      }}
    >
      {children}
    </TagsContext.Provider>
  );
}

export default TagsProvider;
