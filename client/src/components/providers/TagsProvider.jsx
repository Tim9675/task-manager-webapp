import { useContext, useState, useMemo, useCallback, useEffect } from "react";

import { TagsContext } from "../../contexts/TagsContext";
import { TasksContext } from "../../contexts/TasksContext";
import { getUserTags, createTag, updateTag, deleteTag } from "../../api/tagApi";
import { normalizeTitle } from "./helpers/normalizeTitle.js";
import { showApiError, showActionSuccess } from "./helpers/showApiResponse.js";

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
        setUserTags(tags);
      } catch (error) {
        showApiError(error, "Error when fetching tags");
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
    const normalizedTitle = normalizeTitle(title);
    const duplicate = userTags.some(
      (tag) => normalizeTitle(tag.title) === normalizedTitle,
    );
    if (duplicate) return { success: false, error: "duplicate" };

    try {
      setIsCreatingTag(true);
      const res = await createTag(title, color);
      setUserTags((prev) => [...prev, res]);
      showActionSuccess("Tag", "created");
      return { success: true };
    } catch (error) {
      showApiError(error, "Error when creating tag");
      return { success: false, error: "Server error in onCreateTag" };
    } finally {
      setIsCreatingTag(false);
    }
  }

  async function onUpdateTag(updatedTag) {
    const normalizedTitle = normalizeTitle(updatedTag.title);
    const duplicate = userTags.some(
      (tag) =>
        tag._id !== updatedTag._id &&
        normalizeTitle(tag.title) === normalizedTitle,
    );
    if (duplicate) return { success: false, error: "duplicate" };

    try {
      setIsUpdatingTag(true);
      const res = await updateTag(updatedTag);
      setUserTags((prev) =>
        prev.map((tag) => (tag._id === res._id ? res : tag)),
      );
      showActionSuccess("Tag", "updated");
      return { success: true };
    } catch (error) {
      showApiError(error, "Error when updating tag");
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
      showActionSuccess("Tag", "deleted");
    } catch (error) {
      showApiError(error, "Error when deleting tag");
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
